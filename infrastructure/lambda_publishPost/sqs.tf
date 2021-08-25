resource "aws_sqs_queue" "sqs_publish_post" {
  name   = "${var.sqs_publish_post_queue_name}.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  max_message_size          = 2048
  message_retention_seconds=691200 #retains 8 days
#   https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sqs_queue#message_retention_seconds
#   redrive_policy = 5
#   redrive_policy            = "{\"deadLetterTargetArn\":\"${aws_sqs_queue.terraform_queue_deadletter.arn}\",\"maxReceiveCount\":4}"

#   receive_wait_time_seconds = 0 
#   visibility_timeout_seconds = 30
#   High-throughput FIFO queue:
# fifo_throughput_limit = "perMessageGroupId"
  policy = data.aws_iam_policy_document.sqs_publish_post.json
}

data "aws_iam_policy_document" "sqs_publish_post" {
  policy_id = "arn:aws:sqs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:${var.sqs_publish_post_queue_name}/SQSDefaultPolicy"

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
      "arn:aws:sqs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:${var.sqs_publish_post_queue_name}.fifo"
    ]
    condition {
      test     = "ArnEquals"
      variable = "aws:SourceArn"
      values   = [
        "arn:aws:sns:${var.aws_region}:${data.aws_caller_identity.current.account_id}:${var.sns_send_post_topic_name}.fifo"
      ]
    }
  }
}