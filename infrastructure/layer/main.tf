
# Node modules layer

data "archive_file" "lambda_node_modules_layer" {
  type        = "zip"
  source_dir  = "${path.module}/../../.dist/node-modules-layer"
  output_path = "${path.module}/../../.build/node-modules-layer.zip"
}


resource "aws_lambda_layer_version" "lambda_node_modules_layer" {
  layer_name = "lambda-node-modules-layer"
  #   filename            = "${path.module}/../../layers/layers.zip"
  s3_bucket = aws_s3_bucket_object.lambda_node_modules_layer.bucket
  s3_key    = aws_s3_bucket_object.lambda_node_modules_layer.key

  s3_object_version   = aws_s3_bucket_object.lambda_node_modules_layer.version_id
  compatible_runtimes = ["nodejs12.x"]
  source_code_hash    = filebase64sha256(data.archive_file.lambda_node_modules_layer.output_path)
}

resource "aws_s3_bucket_object" "lambda_node_modules_layer" {
  bucket = var.lambda_node_modules_layer_bucket
  #   bucket = aws_s3_bucket.lambda_layer_bucket.id
  key    = "node_modules.zip"
  source = data.archive_file.lambda_node_modules_layer.output_path
  etag   = filemd5(data.archive_file.lambda_node_modules_layer.output_path)
  #   maybe don't need this:
  depends_on = [
  data.archive_file.lambda_node_modules_layer]
}

# Shared layer

data "archive_file" "lambda_shared_layer" {
  type        = "zip"
  source_dir  = "${path.module}/../../.dist/shared-layer"
  output_path = "${path.module}/../../.build/shared-layer.zip"
}

resource "aws_lambda_layer_version" "lambda_shared_layer" {
  layer_name = "lambda_shared_layer"

  s3_bucket = aws_s3_bucket_object.lambda_shared_layer.bucket
  s3_key    = aws_s3_bucket_object.lambda_shared_layer.key

  s3_object_version   = aws_s3_bucket_object.lambda_shared_layer.version_id
  compatible_runtimes = ["nodejs12.x"]
  source_code_hash    = filebase64sha256(data.archive_file.lambda_shared_layer.output_path)
}

resource "aws_s3_bucket_object" "lambda_shared_layer" {
  bucket = var.lambda_shared_layer_bucket

  key    = "node_modules.zip"
  source = data.archive_file.lambda_shared_layer.output_path
  etag   = filemd5(data.archive_file.lambda_shared_layer.output_path)

  depends_on = [
  data.archive_file.lambda_shared_layer]
}
