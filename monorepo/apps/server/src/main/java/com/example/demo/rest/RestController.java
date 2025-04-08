package com.example.demo.rest;

import org.springframework.web.bind.annotation.GetMapping;

@org.springframework.web.bind.annotation.RestController
public class RestController {

  @GetMapping("/register")
  String register(){
    return "register";
  }

  @GetMapping("/login")
  String login(){
    return "login";
  }
}
