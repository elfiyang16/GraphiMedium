// import AWS from 'aws-sdk';
// const sns = new AWS.SNS({ apiVersion: '2010-03-31', region: 'eu-west-1' });
// exports.handler = async () => {
//   let message;
//   //   const { ResultsByTime } = await getDailyCost();
//   if (!ResultsByTime) {
//     throw new Error('Cost result is undefinted');
//   }
//   const result = {
//     date: ResultsByTime[0].TimePeriod?.Start,
//     // totalCost: ResultsByTime[0].Total,
//     totalCost: ResultsByTime[0].Groups?.reduce(
//       (acc, cur) => acc + parseFloat(cur.Metrics!.BlendedCost.Amount ?? '0'),
//       0
//     ),
//     groups: ResultsByTime[0].Groups?.map((group) => ({
//       serviceName: group.Keys![0],
//       stackName: group.Keys![1].split('$')[1],
//       blendedCost: group.Metrics!.BlendedCost.Amount,
//     })),
//   };
//   message = `Your cost from yesterday is: \n
//   Date: ${JSON.stringify(result.date)}\n
//   TotalCost: ${JSON.stringify(result.totalCost)}\n
//   Groups: \n
//   ${JSON.stringify(result.groups)}\n`;
//   let params = {
//     Subject: 'Daily AWS Cost Update',
//     Message: message,
//     TopicArn: process.env.AWS_CHECK_BILL_SNS_TOPIC,
//   };
//   try {
//     await sns
//       .publish(params)
//       .promise()
//       .then((data) => console.log('Successfully published.', data));
//   } catch (error) {
//     console.log(error);
//   }
// };
//# sourceMappingURL=index.js.map