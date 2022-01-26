export enum Selector {
  username = 'input[type=text]',
  password = 'input[type=password]',
  submit = 'button[type=submit]',
  code = "//button[text() = 'Send Security Code']",
  submitCode = "//button[text() = 'Submit']",
  verify = 'input[name=security_code]',
  info = "//button[text() = 'Save Info']"
}