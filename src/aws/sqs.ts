
import * as AWS from 'aws-sdk'
import { SQS, AWSError } from 'aws-sdk'

export async function sendMessage(queue: string, message: string) {
  const sqs = new AWS.SQS({region: String(process.env.region)})
  const messageParams: SQS.SendMessageRequest = {
    QueueUrl: queue,
    MessageBody: message,
  }
  console.log(`publish-message: "${message}" to "${queue}"\n`)
  return sqs.sendMessage(messageParams).promise()
}