<?php
if (isset($_POST['form__email'])) {$email = $_POST['form__email']; if ($email == '') {unset($email);}}
if (isset($_POST['form__message'])) {$message = $_POST['form__message']; if ($message == '') {unset($message);}}
if (isset($_POST['g-recaptcha-response'])) {$g_response = $_POST['g-recaptcha-response']; if ($g_response == '') {unset($g_response);}}

if (isset($email) && isset($message) && isset($g_response)){
  $recaptchaStatus = recaptchaRequest($g_response)["success"];

  if ($recaptchaStatus === True) { sendMail($email, $message); }
}

function sendMail($email, $message) {
  $address = "<jacobxblue@gmail.com>";
  $subject = "Feedback from sobigdrasil.ru";
  $message = "E-mail: $email \nТекст: $message";

  $headers  = "Content-type: text/html; charset=UTF-8 \r\n";
  $headers .= "From: noreply@sobigdrasil.us\r\n";
  //$headers .= "Reply-To: jacobxblue@gmail.com\r\n";

  $send = mail ($address,$subject,$message,$headers);

  include("feedback-response.html");
}

function recaptchaRequest($g_response) {
  $secretKey = "INSERT SECRET KEY";
  $ip = $_SERVER['REMOTE_ADDR'];

  $response=file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=".$secretKey."&response=".$g_response."&remoteip=".$ip);

  $responseArray = json_decode($response,true);

  return $responseArray;
}
?>
