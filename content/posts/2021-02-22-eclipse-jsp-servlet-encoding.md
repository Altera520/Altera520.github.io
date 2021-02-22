---
title: "Eclipse, JSP, Servlet 인코딩"
date: 2021-02-22T13:14:25+09:00
categories:
    - Setting
tags:
    - Eclipse
    - JSP
    - Servlet
---

## 인코딩 설정 관련

### 이클립스 IDE에서의 인코딩

이클립스에서 설정해주는 인코딩 타입은 아래의 경우에서 사용된다.
- 파일의 저장 형식
- 저장된 파일을 읽어서 보여줄 때 사용

여러 사람이 협업하는 상황에서 서로간의 인코딩 설정값이 다르면, 한글같은 2byte 길이의 국가 언어 코드가 깨져보일 수 있다.

<br/>

{{<image src="/images/2021-02-22-eclipse-jsp-servlet-encoding/setting1.png" width="90%" caption="이클립스 인코딩 설정">}}

1. window → Preferences에 들어가서 "encoding" 검색
1. General → Workspace에 들어가서 "Text file encoding" 설정에서 타입을 UTF-8로 변경

<br/>

### JSP의 인코딩

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
```

**JSP 파일은 파일 내의 코드에서 자신을 어떤 인코딩 타입으로 저장할지 정한다.**      
이클립스 환경설정에서 JSP 파일의 인코딩 타입을 설정하면 **이후부터** JSP 파일을 생성할 때 인코딩과 관련한 코드를 설정한 타입으로 하여 생성한다.

<br/>

{{<image src="/images/2021-02-22-eclipse-jsp-servlet-encoding/setting2.png" width="90%" caption="JSP 파일 인코딩 설정">}}

1. window → Preferences에 들어가서 "encoding" 검색
1. Web → JSP Files에 들어가서 "Encoding" 설정에서 타입을 UTF-8로 변경

> JSP 파일 인코딩 설정과 별도로 CSS, HTML파일 또한 위와 같은 방법으로 설정해준다.

<br/>

#### pageEncoding (JSP 파일 저장관련)

pageEncoding 타입은 어떠한 타입으로 인코딩해서 저장할지, 어떠한 타입으로 디코딩해서 출력할지를 저장해주는 설정이다.
pageEncoding 설정이 누락되었다면 JSP 파일에서 서블릿 파일로 변환될때 한글문자가 깨지게됨을 유의한다.

<br/>

#### contentType (클라이언트 전송 관련)

JSP 파일이 서블릿 파일로 변환되고, 서블릿 파일이 클라이언트(브라우저)에게 html을 전송해줄 것이다.       
전송해줄 때, html 내부의 문자열들을 인코딩하는 타입을 지정해주는 부분이 contentType이다.        
contentType에 설정된 타입으로 인코딩하여 데이터를 전송하면서 http 헤더에 contentType을 명시해주는데 브라우저는 헤더의 contentType에 설정된 타입으로 디코딩하여 브라우저에 출력한다.
> contentType에 인코딩 타입이 지정되어있으면 &lt;html&gt;태그 내의 &lt;meta&gt;태그에 지정된 인코딩 타입은 무시된다.

<br/>

#### 인코딩 설정 순위
| target | description |
|:-------|:------------|
| IDE/ Tomcat | <ol><li>pageEncoding</li><li>contentType의 charset 참조 (pageEncoding이 없는 경우)</li><li>시스템 디폴트 설정 참조 (charset 없는 경우)</li></ol> |
| 브라우저 | <ol><li>contentType의 charset</li><li>&lt;html&gt;태그 내의 &lt;meta&gt;태그 참조 (contentType의 charset이 없는 경우)</li><li>브라우저 디폴트 설정 참조 (&lt;meta&gt;태그 없는 경우)</li></ol> |


<br/>

### 서블릿의 인코딩

#### POST request에 대한 인코딩 타입

클라이언트에서 POST로 데이터를 request하는 경우 아래의 순으로 실행된다.
1. 클라이언트에서 서버로 데이터를 보내는 경우에는 `contentType`에 지정했던 타입으로 인코딩하여 전송한다.
1. WAS에서는 받은 데이터를 시스템 디폴트 인코딩 타입으로 디코딩하여 request 객체를 생성한다.<sup>[[1]](#footnote_1)</sup>

<br/>

디폴트 인코딩 타입이 UTF-8로 되어있지않다면 디코딩 시 한글이 깨지므로 서블릿 코드 상에서 별도의 처리를 진행해야한다.        
아래의 코드를 서블릿의 request 객체를 받아오는 메서드내에 포함하면되나 DRY 원칙을 위배하므로 필터에 적용해주도록한다.
```java
request.setCharacterEncoding("UTF-8")
```

<br/>

#### GET request에 대한 인코딩 타입

클라이언트에서 GET으로 데이터를 넘기는 경우 요청 데이터가 URL뒤에 붙어 전송된다.
URI 디폴트 인코딩 방식이 UTF-8로 구성되어있지 않은 경우 한글이 깨지는데 아래의 방법으로 인코딩을 설정할 수 있다.

##### 1. request.setCharacterEncoding 메서드를 사용하도록 설정

`server.xml` 파일의 &lt;Connector&gt;태그(현재 사용하고 있는 포트가 지정된 태그) 내에 `useBodyEncodingForURI`를 true로 설정한다. 이렇게 설정하면 POST 객체 처럼 다룰 수 있다.

```xml
<Connector useBodyEncodingForURI="true" connectionTimeout="20000" 
 port="80" protocol="HTTP/1.1" redirectPort="8443" />
```

##### 2. URI 인코딩 타입을 고정

`server.xml` 파일의 &lt;Connector&gt;태그(현재 사용하고 있는 포트가 지정된 태그) 내에 `URIEncoding`을 UTF-8로 설정한다. 이렇게 설정하면 모든 URI에 대한 인코딩을 설정한 타입으로 강제하게 된다.

```xml
<Connector URIEncoding="UTF-8" port="80" protocol="HTTP/1.1" redirectPort="8443" />
```

<br/>

## footnote

<a name="footnote_1">[1]</a> 디폴트 인코딩 타입은 WAS의 버전마다 다르다.         

<br/>

## References

- [https://codevang.tistory.com/196](https://codevang.tistory.com/196)