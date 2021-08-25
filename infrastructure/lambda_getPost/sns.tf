resource "aws_sns_topic" "sns_send_post" {
  name = "${var.sns_send_post_topic_name}.fifo"
  fifo_topic                  = true
  content_based_deduplication = true

}

resource "aws_sns_topic_subscription" "sqs_subscription" {
  topic_arn = aws_sns_topic.sns_send_post.arn
  protocol  = "sqs"
#   endpoint  = aws_sqs_queue.sqs_publish_post.arn
  endpoint  = var.sqs_publish_post_queue_arn
}

# resource "aws_sns_topic_policy" "sns_send_post" {
#   arn = aws_sns_topic.sns_send_post.arn
#   policy = data.aws_iam_policy_document.sns_send_post.json
# }

//is is redundant with the lambda policy?
# data "aws_iam_policy_document" "sns_send_post" {
#   policy_id = "sns_send_post"
#   statement {
#     actions = [
#       "SNS:Publish",
#     ]
#     condition {
#       test = "ArnLike"
#       variable = "aws:SourceArn"

#       values = [
#         "arn:aws:s3:::${var.aws_s3_bucket_upload_name}",
#       ]
#     }
#     effect = "Allow"
#     principals {
#       type = "AWS"
#       identifiers = [
#         "*"]
#     }
#     resources = [
#       "${aws_sns_topic.upload.arn}",
#     ]
#     sid = "snssqssnss3upload"
#   }
# }