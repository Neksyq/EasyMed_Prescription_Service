import { Kafka, Consumer } from "kafkajs";
import {
  createNewPrescriber,
  checkIfPrescriberExists,
} from "../services/prescriberService";
import { config } from "dotenv";

config();

const kafka = new Kafka({
  clientId: "prescription-service",
  brokers: [`kafka:${process.env.KAFKA_PORT}`],
});

const consumer: Consumer = kafka.consumer({ groupId: "prescriber-group" });

let isConsumerConnected = false;

const handleIncomingMessage = async ({ topic, partition, message }: any) => {
  try {
    if (!message.value) {
      throw new Error("Message value is undefined");
    }

    const eventData = JSON.parse(message.value.toString());
    const prescriberExists = await checkIfPrescriberExists(
      eventData.prescriberId
    );
    if (prescriberExists) {
      console.log(
        `Prescriber with ID ${eventData.prescriberId} already exists, skipping...`
      );
      return;
    }

    if (topic === "prescriber-registration") {
      await createNewPrescriber(eventData);
    }
  } catch (error) {
    console.error("Error processing message:", error);
  }
};

export const runKafkaConsumer = async (): Promise<void> => {
  try {
    await consumer.connect();
    isConsumerConnected = true;
    console.log("Kafka consumer connected");

    await consumer.subscribe({
      topic: "prescriber-registration",
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: handleIncomingMessage,
    });
  } catch (error) {
    console.error("Error connecting Kafka consumer:", error);
    isConsumerConnected = false;
  }
};
