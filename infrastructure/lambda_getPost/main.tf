
locals {
  service_name = "get-post"
}

data "archive_file" "lambda_get_post" {
  type        = "zip"
  source_dir  = "${path.module}/../.dist/src/getPost"
  output_path = "${path.module}/../.build/src/getPost.zip"
}

resource "aws_s3_bucket_object" "lambda_get_post" {
  bucket = var.lambda_get_post_bucket
  key    = "${local.service_name}.zip"
  source = data.archive_file.lambda_get_post.output_path
  etag = filemd5(data.archive_file.lambda_get_post.output_path)
}


resource "aws_lambda_function" "lambda_get_post" {
  function_name = local.service_name
  s3_bucket = var.lambda_get_post_bucket
  s3_key        = aws_s3_bucket_object.lambda_get_post.key

  runtime = "nodejs12.x"
  handler = "getPostLambda.handler"
  timeout = 900
  environment {
    variables = {
      AWS_ACCOUNT_ID  = data.aws_caller_identity.current.account_id,
      AWS_REGION = var.aws_region
      SNS_SEND_POST_NAME = var.sns_send_post_name
      MEDIUM_USERNAME             = var.medium_username
    }
  }

  source_code_hash = data.archive_file.lambda_get_post.output_base64sha256
  role             = aws_iam_role.lambda_exec.arn

  layers = [var.lambda_node_modules_layer_arn, var.lambda_shared_layer_arn]
  # Make sure the role policy is attached before trying to use the role
  depends_on = [aws_iam_role_policy_attachment.lambda_policy]
}

resource "aws_cloudwatch_log_group" "lambda_get_post" {
  # /aws/lambda/<Function Name>
  name              = "/aws/lambda/${aws_lambda_function.lambda_get_post.function_name}"
  retention_in_days = 30
}

# an IAM role that allows Lambda to access resources in your AWS account.
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


# resource "aws_iam_role_policy" "lambda_logging" {
#   name = "lambda_logging"

#   role = aws_iam_role.lambda_exec_role.id

#   policy = <<EOF
# {
#     "Version"  : "2012-10-17",
#     "Statement": [
#         {
#             "Effect"  : "Allow",
#             "Resource": "*",
#             "Action"  : [
#                 "logs:CreateLogStream",
#                 "logs:PutLogEvents",
#                 "logs:CreateLogGroup"
#             ]
#         }
#     ]
# }
# EOF
# }

# resource "aws_iam_role_policy" "lambda_s3_access" {
#   name = "lambda_s3_access"

#   role = aws_iam_role.lambda_exec_role.id

#   # TODO: Change resource to be more restrictive
#   policy = <<EOF
# {
#   "Version"  : "2012-10-17",
#   "Statement": [
#     {
#       "Effect": "Allow",
#       "Action": [
#         "s3:ListBuckets",
#         "s3:PutObject",
#         "s3:PutObjectAcl",
#         "s3:GetObjectAcl"
#       ],
#       "Resource": ["*"]
#     }
#   ]
# }
# EOF
# }
