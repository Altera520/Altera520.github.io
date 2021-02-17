---
title: "자바의 동적 로딩"
date: 2021-01-23T18:45:56+09:00
draft: true
categories:
    - Programming
tags:
    - Java
---

## 동적로딩에 대한 정의

Java 언어의 특징 중 하나가 동적로딩을 지원한다는 것이다.

동적로딩이란 초기 실행시에 모든 클래스를 로딩하는 것이 아닌,         
**런타임 중 필요한 시점에 특정 클래스를 로딩**하는 방식을 의미한다.

또한, 동적로딩은 [클래스 로더](/posts/2021-01-12-jvm/#클래스-로더class-loader)에서 클래스를 로드하는 시점에 따라서 로딩 방식이 분류된다.
- 로드타임 동적로딩 (Load-time dynamic loading)
- 런타임 동적로딩 (Run-time dynamic loading)

<br/>

### 로드타임 동적로딩
로드타임 동적로딩이란 **하나의 클래스를 로딩하는 과정에 있어서, 해당 클래스와 관련된 클래스들을 한꺼번에 로딩하는 것이다.**

```java
public class Program {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}
```

위의 코드에서 `Program` 클래스의 static 메서드인 `main`이 String 배열 타입을 파라미터로 사용하고 메서드 내에서는 System 객체를 호출하고 있다.        
`Program`클래스가 클래스 로더에 의해 Method Area로 로딩될 때 `java.lang.String`과 `java.lang.System` 클래스가 동시에 로딩된다.

<br/>

### 런타임 동적로딩
런타임 동적로딩이란 **코드를 실행하는 순간에 필요한 클래스를 로딩하는 것이다.**

```java
public class Program {
    public static main(String[] args) {
        try {
            Class vectorClass = Class.forName("java.util.Vector");
            Method[] methods = vectorClass.getDeclaredMethods();
        } catch (ClassNotFoundException e) {
            // Exception Handling
        }
    }
}
```

`main`메서드 실행 중 `Class.forName()` 호출을 통해 파라미터에 대응되는 클래스를 로딩시킨다.

<br/>

#### 런타임 동적로딩과 리플렉션(Reflection)
런타임 동적로딩은 자바에서 지원하는 리플렉션(Reflection)과 직결된다.


<br/>

## References