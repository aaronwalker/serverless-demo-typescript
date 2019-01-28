
import * as _ from 'lodash'
import { sendMessage } from './aws/sqs'

// modern module syntax
export async function hello(event, context, callback) {

  // dependencies work as expected
  console.log(_.VERSION)
  console.log('event: ', JSON.stringify(event));

  const msg = await sendMessage(String(process.env.queue), '{"message":"important message"}');

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello world!' + process.env.myvalue,
      input: event,
    }),
  };
  callback(null, response);

}

export async function receiver(event, context, callback) {

  // dependencies work as expected
  console.log(_.VERSION)
  console.log('event: ', JSON.stringify(event));
  const body = event.Records[0].body;
  console.log("text: ", body);

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'SQS Processed Message',
      input: event,
    }),
  };
  callback(null, response);

}