const AWSMock = require('aws-sdk-mock');

import { hello } from './handler';
import { receiver } from './handler';
import { expect } from 'chai';
import 'mocha';
import * as AWS from 'aws-sdk'

AWSMock.setSDKInstance(AWS);
AWSMock.mock('SQS', 'sendMessage')

process.env.queue = 'https://sqs.ap-southeast-2.amazonaws.com/857301260320/dummy'
process.env.region = 'ap-southeast-2'

describe('Hello Handler', () => {

  it('should send an sqs message and return hello world', () => {
    process.env.myvalue = ' really!!'
    const result = hello({body: 'test'}, null, (req,res)=>{
      expect(res.body).to.equal('{"message":"Hello world! really!!","input":{"body":"test"}}');
    });
  });

});

describe('Receiver Handler', () =>{

  it('should receive an sqs message', () => {
    const event = {
      Records: [
        { body: "test" }
      ]
    }
    const result = receiver(event, null, (req,res)=> {
      expect(res.body).to.equal('{"message":"SQS Processed Message","input":{"Records":[{"body":"test"}]}}');
    });
  });

});