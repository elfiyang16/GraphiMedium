terraform {
  backend "remote" {
    organization = "elfi-my-zone"

    workspaces {
      name = "aws-medium-contenful"
    }
  }

  required_version = ">= 0.13.0"
}
