locals {
  service_name = "get-post"
}

data "archive_file" "lambda_get_post" {
  type        = "zip"
  source_dir  = "${path.module}/../../.dist/src/getPost"
  output_path = "${path.module}/../../.build/src/getPost.zip"
}

resource "aws_s3_bucket_object" "lambda_get_post" {
  bucket = var.lambda_get_post_bucket
  key    = "${local.service_name}.zip"
  source = data.archive_file.lambda_get_post.output_path
  etag   = filemd5(data.archive_file.lambda_get_post.output_path)
}


resource "aws_lambda_function" "lambda_get_post" {
  function_name = local.service_name
  s3_bucket     = var.lambda_get_post_bucket
  s3_key        = aws_s3_bucket_object.lambda_get_post.key

  runtime = "nodejs12.x"
  handler = "getPostLambda.handler"
  timeout = 900
  memory_size = 256
  environment {
    variables = {
      AWS_ACCOUNT_ID           = var.aws_account_id
      SNS_SEND_POST_TOPIC_NAME = var.sns_send_post_topic_name
      MEDIUM_USERNAME          = var.medium_username
    }
  }

  source_code_hash = data.archive_file.lambda_get_post.output_base64sha256
  role             = aws_iam_role.lambda_exec.arn

  layers = [var.lambda_node_modules_layer_arn, var.lambda_shared_layer_arn]
  # Make sure the role policy is attached before trying to use the role
  depends_on = [aws_iam_role_policy_attachment.attach_lambda_role_policy]
}

resource "aws_cloudwatch_log_group" "lambda_get_post" {
  # /aws/lambda/<Function Name>
  name              = "/aws/lambda/${aws_lambda_function.lambda_get_post.function_name}"
  retention_in_days = 30
}

resource "aws_iam_role" "lambda_exec" {
  name = "${local.service_name}-lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_lambda_role_policy" {
  role = aws_iam_role.lambda_exec.name
  # policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  policy_arn = aws_iam_policy.lambda_get_post_policy.arn

}

resource "aws_iam_policy" "lambda_get_post_policy" {
  name   = "${local.service_name}-lambda-policy"
  policy = data.aws_iam_policy_document.lambda_get_post_policy_document.json
}


data "aws_iam_policy_document" "lambda_get_post_policy_document" {
  statement {
    sid    = ""
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = [
      "*"
    ]
  }
  # Temporarily comment out to avoid cycle with line:
  # # depends_on = [aws_iam_role_policy_attachment.attach_lambda_role_policy]

  # statement {
  #   sid = ""
  #   effect = "Allow"
  #   actions = [
  #     "logs:CreateLogGroup"
  #   ]
  #   resources = [
  #     "arn:aws:logs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:*"
  #   ]
  # }

  # statement {
  #   sid = ""
  #   effect = "Allow"
  #   actions = [
  #     "logs:CreateLogStream",
  #     "logs:PutLogEvents"
  #   ]
  #   resources = [
  #     "arn:aws:logs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/${aws_lambda_function.lambda_get_post.function_name}:*"
  #   ]
  # }

  statement {
    sid    = ""
    effect = "Allow"
    actions = [
      "SNS:Publish"
    ]
    resources = [
      aws_sns_topic.sns_send_post.arn
    ]
  }
}

