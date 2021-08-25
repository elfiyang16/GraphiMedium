
locals {
  service_name = "publish-post"
}

data "archive_file" "lambda_publish_post" {
  type        = "zip"
  source_dir  = "${path.module}/../.dist/src/publishPost"
  output_path = "${path.module}/../.build/src/publishPost.zip"
}

resource "aws_s3_bucket_object" "lambda_publish_post" {
  bucket = var.lambda_publish_post_bucket
  key    = "${local.service_name}.zip"
  source = data.archive_file.lambda_publish_post.output_path
  etag = filemd5(data.archive_file.lambda_publish_post.output_path)
}


resource "aws_lambda_function" "lambda_publish_post" {
  function_name = local.service_name
  s3_bucket = var.lambda_publish_post_bucket
  s3_key        = aws_s3_bucket_object.lambda_publish_post.key

  runtime = "nodejs12.x"
  handler = "publishPostLambda.handler"
  timeout = 900
  environment {
    variables = {
      CONTENTFUL_MANAGEMENT_TOKEN = var.contenful_management_token
      CONTENTFUL_SPACE_ID         = var.contentful_space_id
    }
  }

  source_code_hash = data.archive_file.lambda_publish_post.output_base64sha256
  role             = aws_iam_role.lambda_exec.arn

  layers = [var.lambda_node_modules_layer_arn, var.lambda_shared_layer_arn]
  depends_on = [aws_iam_role_policy_attachment.lambda_policy]
}

resource "aws_cloudwatch_log_group" "lambda_publish_post" {
  name              = "/aws/lambda/${aws_lambda_function.lambda_publish_post.function_name}"
  retention_in_days = 30
}

resource "aws_iam_role" "lambda_exec" {
  name = "serverless_lambda"

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

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}