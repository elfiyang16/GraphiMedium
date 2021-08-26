resource "aws_cloudwatch_event_rule" "every_week" {
  name        = "every-week"
  description = "Fires every week"
  #   weekly Sunday at 9:30 
  #   schedule_expression = "cron(30 9 * * 0)"
  schedule_expression = "cron(44 19 ? * THU *)"
}

resource "aws_cloudwatch_event_target" "lambda_get_post" {
  rule = aws_cloudwatch_event_rule.every_week.name
  # Looks weird
  target_id = "lambda_get_post"
  arn       = aws_lambda_function.lambda_get_post.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_lambda_get_post" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_get_post.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.every_week.arn
}
