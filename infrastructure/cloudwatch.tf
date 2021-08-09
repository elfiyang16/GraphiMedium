resource "aws_cloudwatch_event_rule" "every_week" {
  name        = "every-week"
  description = "Fires every week"
  #   weekly Sunday at 9:30 
  #   schedule_expression = "cron(30 9 * * 0)"
  schedule_expression = "cron(38 15 ? * MON *)"
}

resource "aws_cloudwatch_event_target" "lambda_medium_contentful" {
  rule      = aws_cloudwatch_event_rule.every_week.name
  target_id = "lambda_medium_contentful"
  arn       = aws_lambda_function.lambda_medium_contentful.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_lambda_medium_contentful" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_medium_contentful.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.every_week.arn
}
