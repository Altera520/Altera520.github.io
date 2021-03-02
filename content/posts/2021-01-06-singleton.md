---
title: "싱글턴(Singleton)"
date: 2021-01-06T16:00:13+09:00
categories:
    - OOP
tags:
    - Java
    - Design Pattern
    - Spring
---

## 싱글턴 정의

GoF 디자인 패턴에서 **생성 패턴**으로 분류된다.       
클래스에 대한 인스턴스가 오직 1개만 생성되어야 하는 경우에 사용하는 패턴이다.

다중 스레드 환경이라면 싱글턴을 설계할 때 **동시성(concurrency)** 을 필히 고려하여 **Thread-safe**하게 만들어야한다.        
다중 스레드 환경에서 동시성을 고려하지않고 싱글턴 클래스를 설계하면 인스턴스가 2개이상 생성될 수 있기에 예기치 못한 동작을 일으킬 수 있다.

<br/>

## 싱글턴 패턴 구현 방식

Thread-safe한 구현방식에는 차이가 있어도 `private constructor`와 `static method`를 사용하는 것은 공통이다.

### 0. Thread-unsafe한 방식
```java
public class Singleton {
    private Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        if(instance == null) {
            instance = new Singleton();
        }
        return instance; 
    } 
}
```
싱글 스레드라면 해당 방식을 사용해도 문제없으나 다중 스레드 환경이라면 2개 이상의 인스턴스가 생성될 수 있다.        
따라서 다중 스레드 환경에서는 해당 방식을 사용해서는 안된다.

<br/>

### 1. 이른 초기화
```java
public class Singleton {
    private static Singleton instance = new Singleton();

    private Singleton() {}

    public static Singleton getInstance() {
        return instance; 
    } 
}
```
클래스 로더가 초기화하는 시점에 정적 바인딩을 통해 인스턴스를 메모리에 등록하는 방식
- 컴파일 시점에 인스턴스 생성
- **인스턴스 사용유무와 상관없이 컴파일 시점에 항상 인스턴스가 생성되어 메모리에 할당된다.**

<br/>

### 2. 동기화 블럭
```java
public class Singleton {
    private static Singleton instance;

    private Singleton() {}

    public static synchronzied Singleton getInstance() {
        if(instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```
메서드에 동기화 블럭(`synchronized` 키워드 사용)을 지정하여 생성하는 방식
- 인스턴스가 필요한 시점에 동적바인딩하여 생성
- **인스턴스가 생성이 되었건 안되었건 동기화 블럭을 거치므로 성능이 상당히 저하**       
([Benchmarking Java Locks with Counters](http://isuru-perera.blogspot.com/2016/05/benchmarking-java-locks-with-counters.html))

<br/>

### 3. DCL (Double Checked Locking)
```java
public class Singleton {
    private volatile static Singleton instance;

    private Sigleton() {}

    public Singleton getInstance() {
      if(instance == null) {
         synchronized(Singleton.class) {
            if(instance == null) {
               instance = new Singleton(); 
            }
         }
      }
      return instance;
    }
}
```
동기화 블럭 방식의 문제점인 동기화 오버헤드를 개선한 방식     
- 인스턴스가 생성되지 않은 경우(`null`인 경우)에만 동기화 블럭이 실행
- **흔치 않은 경우이나, DCL 사용시 문제가 되는 경우가 존재**        
ex) `T1`과 `T2` 스레드가 존재하며 인스턴스가 아직 생성되지 않은 상태에서 `T1`과 `T2`가 `getInstance` 메서드를 호출한다고 가정하였을 때, `T1`이 인스턴스 생성을 완전히 완료하기 전에 인스턴스에 대한 메모리 공간을 할당할 수 있다. 이 때, `T2`가 인스턴스에 대한 메모리가 할당된 것을 보고 인스턴스를 사용하려고 할 수 있는데 인스턴스의 생성이 완전히 완료된것이 아니므로 문제가 발생할 수 있다.

<br/>

### 4. Enum
```java
public enum Singleton {
    INSTANCE; 
}
```
`class`대신 `enum`을 사용하는 방식
- 복잡한 직렬화 상황 또는 리플렉션 상황에서 직렬화가 자동으로 지원되기에 인스턴스가 2개이상 생성되는 것을 막아준다.
- enum의 초기화는 컴파일 시점에 수행
- **Context 의존성이 있는 환경이라면 인스턴스의 메서드 등을 호출할때마다 Context 정보를 넘겨야할 수 있기에 오버헤드 발생 가능**


<br/>

### 5. Lazy Holder
```java
public class Singleton {
    private Singleton() {}

    private static class LazyHolder() {
        private static final Singleton INSTANCE = new Singleton();
    }

    public static Singleton getInstance() {
        return LazyHolder.INSTANCE;
    }
}
```
동시성 문제를 해결하는데 `volatile`, `synchronized` 키워드를 사용하지 않으므로 성능이 뛰어나며 가장 많이 사용하는 방식이다.         
`Singleton` 클래스 내부에 `LazyHolder` 타입의 변수가 없으므로 클래스 로더는 초기화 때 `LazyHolder`를 초기화하지 않으며, `getInstance` 메서드를 호출할 때 클래스 로더에 의해 초기화가 수행된다.

<br/>

### 주의사항

1. 다중 스레드 환경에서 Thread-safe를 보장해야하므로 stateless해야 한다. 
    ```java
    public class Singleton {
        private final OTHER_SINGLETON;      // (1) 다른 싱글턴 인스턴스 참조는 가능
        private Obejct object               // (2) Static Area에 저장되므로 불가능
    }
    ```
    - 싱글턴은 상태 정보를 클래스 내부에 가지고 있으면 안된다. 하지만, 클래스 내부에서 다른 싱글턴 인스턴스를 참조하는 경우는 가능하다.
2. 클래스 로더를 2개 이상 사용하면 싱글턴 인스턴스가 2개 이상 생성될수 있다.
    - 이 경우 복수개의 인스턴스가 생성되지 않도록 클래스 로더를 지정해야한다.

<br/><br/>

## 스프링에서 싱글턴 사용예
스프링에서 어노테이션 설정 또는 xml 설정을 통해 IoC 컨테이너에게 제어권을 넘겨주어 빈을 생성할 수 있다.     
빈을 등록할 때 아래의 예시처럼 `scope`를 지정가능하다. 이 때 기본 `scope`를 명시하지 않으면 기본적으로`singleton`으로 적용되어 빈이 생성된다.
```xml
<!-- xml을 사용한 방식 -->
<bean id="..." 
    class="..." 
    scope="prototype">
</bean>
```
```java
/* annotaton을 사용한 방식 */
// (1)
@Component
@Scope("prototype")
public class StudentInfo {
    ...
}

// (2)
@Configuration
public class ConfigurationBeanFactory {

    @Bean
    @Scope("prototype")
    public StudentInfo StudentInfo(){
        return new StudentInfo();
    }
}
```
- **singleton (default) :** IoC 컨테이너 내에 단 하나만 존재한다.
- **prototype :** 컨테이너에 빈을 요청할때마다 새로운 인스턴스 생성
- **request :** HTTP 요청 하나당 하나의 인스턴스 생성
- **session :** 하나의 세션당 하나의 인스턴스 생성

<br/>

### Bean을 Singleton으로 생성하는 이유

사용자로부터 요청이 발생하면 3계층(Presentation Layer - Business Layer - Persistence Layer)을 구성하는 객체들이 사용자 요청을 처리하여 결과를 응답한다.     
매번 사용자 요청마다 새로운 객체를 생성하게되면 `GC`가 자주 수행되어 `Stop-The-World`가 발생하게되고 메모리 오버헤드가 발생할 수 있다. 이 문제를 해결하기위해 빈을 기본적으로 싱글턴으로 생성하며 Java 엔터프라이즈에서는 `Service Object`라는 개념을 사용한다.

대표적으로 `Service Object`라는 개념에 속하는 서블릿이 멀티 스레딩 환경에서 싱글턴으로 동작하며 사용자 요청 처리를 담당하는 스레드들이 서블릿을 공유하여 사용한다.

<br/>

### ApplicationContext

스프링에서 싱글턴을 관리하는 주체가 `ApplicationContext`이며 IoC 컨테이너, 스프링 컨테이너, 빈 팩토리, SingletonRegistry 등으로 불린다.

{{<image src="/images/2021-01-06-singleton/ApplicationContext.png" width="100%" caption="ApplicationContext 다이어그램">}}

`ApplicationContext` 인터페이스는 `BeanFactory` 인터페이스를 상속하며, `BeanFactory` 인터페이스의 구현체가 `DefaultListableBeanFactory`이다.        
대부분의 스프링 애플리케이션 컨텍스트는 `DefaultListableBeanFactory`를 빈 팩토리로 사용한다.
- `DefaultListableBeanFactory` 클래스는 `SingletonBeanRegistry` 인터페이스를 구현하고 있는데 해당 구현부가 싱글턴을 관리하는 기능들을 포함하고 있다.

{{<image src="/images/2021-01-06-singleton/DefaultListableBeanFactory.png" width="100%" caption="DefaultListableBeanFactory 다이어그램">}}

Java와 스프링에서 싱글턴 객체의 라이프사이클이 다르다. 자바는 클래스 로더 기준이며, 스프링에서는 ApplicationContext가 기준이다.
- **클래스 로더 기준**이라는 것은 톰캣이 WAR 파일을 만들게 되면, WAR 파일 하나 당 클래스 로더가 1:1 관계로 배치가된다. 다른 WAR 파일은 참조가 불가능하다.
- **ApplicationContext 기준**이라는 것은 web.xml 에서 root context 하나와 servlet context 여러개를 등록할 수 있다. 이 때 각각의 context 들이 싱글턴 범위가 된다.
    > root context와 servlet context 설명은 [스프링의 컨텍스트](/posts/2021-01-09-spring_context/)참조

<br/>

## References
- [webeveloper님의 블로그 - 싱글턴 패턴](https://medium.com/webeveloper/%EC%8B%B1%EA%B8%80%ED%84%B4-%ED%8C%A8%ED%84%B4-singleton-pattern-db75ed29c36)
- [Leopold님의 블로그 - Multi Thread 환경에서의 올바른 Singleton](https://medium.com/@joongwon/multi-thread-%ED%99%98%EA%B2%BD%EC%97%90%EC%84%9C%EC%9D%98-%EC%98%AC%EB%B0%94%EB%A5%B8-singleton-578d9511fd42)
- [gmlwjd9405님의 블로그 - Spring Bean의 개념과 Bean Scope 종류](https://gmlwjd9405.github.io/2018/11/10/spring-beans.html)
- [programmersought.com - Spring container core class](https://www.programmersought.com/article/88206033054/)
- [kouzie님의 블로그](https://kouzie.github.io/spring/Spring-%EA%B0%9C%EC%9A%94/#%EC%8A%A4%ED%94%84%EB%A7%81-%EC%BB%A8%ED%85%8C%EC%9D%B4%EB%84%88-%EC%A2%85%EB%A5%98)