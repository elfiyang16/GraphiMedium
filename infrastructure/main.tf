# resource "aws_iam_role""lambda_role"{
#  name   = "iam_role_lambda_function"
#  assume_role_policy = <<EOF
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Action": "sts:AssumeRole",
#       "Principal": {
#         "Service": "lambda.amazonaws.com"
#       },
#       "Effect": "Allow",
#       "Sid": ""
#     }
#   ]
# }
# EOF
# }

# # IAM policy for logging from a lambda

# resource "aws_iam_policy" "lambda_logging" {

#   name         = "iam_policy_lambda_logging_function"
#   path         = "/"
#   description  = "IAM policy for logging from a lambda"
#   policy = <<EOF
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Action": [
#         "logs:CreateLogGroup",
#         "logs:CreateLogStream",
#         "logs:PutLogEvents"
#       ],
#       "Resource": "arn:aws:logs:*:*:*",
#       "Effect": "Allow"
#     }
#   ]
# }
# EOF
# }

# # Policy Attachment on the role.

# resource "aws_iam_role_policy_attachment" "policy_attach" {
#   role        = aws_iam_role.lambda_role.name
#   policy_arn  = aws_iam_policy.lambda_logging.arn
# }

# # Generates an archive from content, a file, or a directory of files.
# data "archive_file" "default" {
#   type        = "zip"
#   source_dir  = "${path.module}/files/"
#   output_path = "${path.module}/myzip/python.zip"
# }

# # Create a lambda function
# # In terraform ${path.module} is the current directory.

# resource "aws_lambda_function" "lambdafunc" {
#   filename                       = "${path.module}/myzip/python.zip"
#   function_name                  = "My_Lambda_function"
#   role                           = aws_iam_role.lambda_role.arn
#   handler                        = "index.lambda_handler"
#   runtime                        = "python3.8"
#   depends_on                     = [aws_iam_role_policy_attachment.policy_attach]
# }






# =========================================

locals {
  service_name = "medium-contentful-blog-pipeline"
}

data "archive_file" "lambda_medium_contentful" {
  type = "zip"

  source_dir  = "${path.module}/../dist"
  output_path = "${path.module}/../dist/src.zip"
}

resource "aws_s3_bucket_object" "lambda_medium_contentful" {
  bucket = aws_s3_bucket.lambda_bucket.id
  key    = "${local.service_name}.zip"
  source = data.archive_file.lambda_medium_contentful.output_path
  #   source code changed, the computed etag
  etag = filemd5(data.archive_file.lambda_medium_contentful.output_path)
}


resource "aws_lambda_function" "lambda_medium_contentful" {
  function_name = local.service_name
  s3_bucket     = aws_s3_bucket.lambda_bucket.id
  s3_key        = aws_s3_bucket_object.lambda_medium_contentful.key

  runtime = "nodejs12.x"
  handler = "index.handler"
  #   timeout = 900
  environment {
    variables = {
      #   ACCOUNT_ID  = "${data.aws_caller_identity.current.account_id}",
      MEDIUM_USERNAME             = var.medium_username
      CONTENTFUL_MANAGEMENT_TOKEN = var.contenful_management_token
      CONTENTFUL_SPACE_ID         = var.contentful_space_id
    }
  }

  # source_code_hash attribute will change whenever 
  # you update the code contained in the archive, 
  # which lets Lambda know that there is a new version of your code available.
  source_code_hash = data.archive_file.lambda_medium_contentful.output_base64sha256
  role             = aws_iam_role.lambda_exec.arn

  # Make sure the role policy is attached before trying to use the role
  depends_on = [aws_iam_role_policy_attachment.lambda_policy]
}

resource "aws_cloudwatch_log_group" "lambda_medium_contentful" {
  # /aws/lambda/<Function Name>
  name              = "/aws/lambda/${aws_lambda_function.lambda_medium_contentful.function_name}"
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
