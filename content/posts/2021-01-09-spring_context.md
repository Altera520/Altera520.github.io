---
title: "스프링의 컨텍스트"
date: 2021-01-09T18:22:32+09:00
draft: true
categories:
    - Programming
tags:
    - Spring
---

## 스프링의 컨텍스트 정의

스프링에서 `WebApplicationContext`는 `ApplicationContext`인터페이스를 확장한 `WebApplicationContext` 구현체를 의미한다.

- **root context**
    - `DispatcherServlet`이 여러개가 존재할때 공통으로 사용할 빈들을 root context에 선언해두고 서블릿간에 공유하기 위한 목적으로 사용한다.
- **servlet context**
    - servlet context에 등록되는 빈들은 해당 servlet context에서만 사용가능하다.        

<br/>

첨부한 그림처럼 servlet context에서 root context에 등록된 빈들을 참조하는 것은 가능하나 반대의 경우(root context에서 servlet context에 등록된 빈들의 참조)는 불가능하다.

{{<image src="/images/2021-01-09-spring_context/spring-context.png" width="70%">}}

<br/><br/>

## 스프링부트에서의 컨텍스트

<br/><br/>

## References

- [docs.spring.io - Web on Servlet Stack](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc)