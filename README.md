## Medium -- Contentful Blog Pipeline

![diagram](https://user-images.githubusercontent.com/29664811/145841052-acf74330-06a9-42df-8064-76f4515dc82e.png)

This is the backend pipeline of the personal blog sites using TypeScript and Terraform.
(I tend to write on Medium.com first before migrate the content to contentful)

#### Design

A cloudwatch event rule will trigger the lambda every week, which will do the ETL from medium.com to contentful (The transformation is to convert Html to Markdown and then to RichText which is what Contentful expects).
I used a Fanout (may not be necessary) to push the changes to DynamoDB for data persistence purpose as well as a Email notification using SES.

#### TODOs

- DynamoDB (archive to S3-> Glacier with TTL)
- How to keep the data idempotent (Even there's is FIFO queue right now to ensure exact once processing, there are some 3rd parties involved (aka. Contentful ) that is very difficult to ensure that it adheres to the same atomic commit protocol used by the AWS services, e.g. there can be side effects that contentful publishes one blog several times)
- Rate limit with blog publish

#### Infrastructure

All services are provisioned using Terraform as shown in `/infrastructure` folder.

#### Structure

Everything should be quite clear from the diagram above. Just to note that 2 shared layers for lambdas are used, which needs some care during deployment. See the `postbuild` related scripts in `package.json`.

#### Run and Deploy

To run the project:

```
npm install && ts-node index.ts
```

To deploy, register an account with Terraform cloud and add the repository to your registry. The code can be configured to deploy on every push to the github.
