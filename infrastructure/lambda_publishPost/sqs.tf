resource "aws_sqs_queue" "sqs_publish_post" {
  name                        = "${var.sqs_publish_post_queue_name}.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  max_message_size            = 2048   #256 KB
  message_retention_seconds   = 691200 #retains 8 days
  #   https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sqs_queue#message_retention_seconds
  #   redrive_policy = 5
  #   redrive_policy            = "{\"deadLetterTargetArn\":\"${aws_sqs_queue.terraform_queue_deadletter.arn}\",\"maxReceiveCount\":4}"
  # redrive_policy  = "{\"deadLetterTargetArn\":\"${aws_sqs_queue.results_updates_dl_queue.arn}\",\"maxReceiveCount\":5}"
  #  long polling
  receive_wait_time_seconds = 10
  # Depending on how long it takes to process a message, extend the message’s visibility timeout to the max time it takes to process and delete the message.
  # https://github.com/aws/serverless-application-model/issues/1424
  # heartbeat: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html
  visibility_timeout_seconds = 800 #default 30
  #   High-throughput FIFO queue:
  # fifo_throughput_limit = "perMessageGroupId"
  policy = data.aws_iam_policy_document.sqs_publish_post.json
}

data "aws_iam_policy_document" "sqs_publish_post" {
  policy_id = "arn:aws:sqs:${var.aws_region}:${var.aws_account_id}:${var.sqs_publish_post_queue_name}/SQSDefaultPolicy"

  statement {
    sid    = "sns-to-sqs"
    effect = "Allow"
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }
    actions = [
      "SQS:SendMessage",
    ]
    resources = [
      "arn:aws:sqs:${var.aws_region}:${var.aws_account_id}:${var.sqs_publish_post_queue_name}.fifo"
    ]
    condition {
      test     = "ArnEquals"
      variable = "aws:SourceArn"
      values = [
        "arn:aws:sns:${var.aws_region}:${var.aws_account_id}:${var.sns_send_post_topic_name}.fifo"
      ]
    }
  }
}

# DLQ

# resource "aws_sqs_queue" "results_updates_dl_queue" {
#     name = "results-updates-dl-queue"
# }

# resource "aws_sns_topic_subscription" "results_updates_sqs_target" {
#     topic_arn = "${aws_sns_topic.results_updates.arn}"
#     protocol  = "sqs"
#     endpoint  = "${aws_sqs_queue.results_updates_queue.arn}"
# }
