---
title: "[Java8의 변경사항] 1. 특징 및 람다 표현식"
date: 2021-02-17T20:22:31+09:00
categories:
    - Programming
tags:
    - Java
    - Lambda
---

## Java8의 특징

자바 8은 2014년 3월에 출시된 LTS 버전이며 제공하는 주요기능은 다음과 같다.

- **람다 표현식**: 함수형 프로그래밍
- **Stream API**: 시퀀셜한 데이터의 추상화된 사용
- **java.time 패키지**: 개선된 Date, Time API 제공
- **나즈혼(Nashorn)**: 자바스크립트의 새로운 엔진 도입

> **LTS(Long-Term-Support) 버전**      
    LTS 버전 배포 주기는 3년이며 지원기간은 5년이상으로서 production환경에서는 LTS 버전을 권장한다.        
    비LTS 버전의 경우 배포 주기는 6개월이며 지원기간은 배포 이후 6개월로 제공기간이 짧다.

<br/>

## 람다 표현식 (Lambda Expression)

람다 표현식이란 **익명 클래스의 한개 메서드를 표현식으로 나타낸 것**이다.     
람다식의 장단점은 아래와 같다.

- <span class="md-b">람다식 장점</span>
    1. 코드가 간결해지고 가독성이 향상된다.
    1. 병렬 프로그래밍이 용이하다.

- <span class="md-r">람다식 단점</span>
    1. 디버깅이 복잡해진다.
    1. 람다식으로 작성된 함수는 재사용이 불가능하다.

<br/>
정리하자면 람다 표현식 사용 시 작성된 코드의 가독성을 높일 수 있으나 무분별한 사용은 코드가 지저분해질 수 있을뿐더러 디버깅이 까다로워지니 적절히 사용해야할 것이다.
<br/><br/>

#### 람다표현식 작성법
```
(매개변수 리스트) -> {함수 몸체}
```
1. 매개변수가 하나인 경우 `()`를 생략가능하다.
1. 매개변수의 타입은 생략 가능하나 명시할 수도 있다. (생략시 컴파일러가 타입 추론)
1. 함수 몸체가 한 줄인 경우 `{}`와 `return`을 생략 가능하다.

<br/>

### 함수형 인터페이스 (Functional interface)
람다 표현식을 사용하기 위해서는 우선, 함수형 인터페이스가 필요하다.         
함수형 인터페이스란 **단 한개의 추상 메서드만을 가지는 인터페이스**를 말하며 `@FunctionalInterface` 어노테이션을 사용하여 함수형 인터페이스임을 명시할 수 있다.

아래의 코드는 함수형 인터페이스를 정의하고 이를 익명 클래스와 람다식으로 사용하는 예제이다.

```java
@FunctionalInterface
public interface LambdaExample {
    //abstract void run();      abstract 생략 가능
    void run();
}

...

public class Program {
    public static void main(String[] args) {
        /* 익명 클래스로 사용 */
        LambdaExample le1 = new LambdaExample() {
            @Override
            public void run() {
                System.out.println("run");
            }
        }
        le1.run();

        /* 람다 표현식으로 사용 */
        LambdaExample le2 = () -> System.out.println("run");
        le2.run();
    }
}
```

<br/>

함수형 인터페이스를 개발자가 직접 정의해서 사용할수도 있으나, 자바8에서 기본적으로 제공해주는 함수형 인터페이스들이 `java.util.function`에 존재한다.

<details>
    <summary>기본 제공 함수형 인터페이스</summary>
{{% table "100%" %}}
| name | description |
|:-----|:------------|
| Function&lt;T, V&gt; | <ul><li>apply : T 타입을 받아서 V 타입을 리턴</li><li>compose : 함수 조합, 파라미터로 들어온 함수가 우선 수행</li><li>andThen : 함수 조합, 파라미터로 들어온 함수가 이후 수행</li></ul> |
| UnaryOperator&lt;T&gt; | Function&lt;T, T&gt;를 extends <ul><li>apply : T 타입을 받아서 T 타입을 리턴</li></ul>|
| BiFunction&lt;T, U, V&gt; | <ul><li>apply : T, U 타입을 받아서 V 타입을 리턴</li></ul> |
| BinaryOperator&lt;T&gt; | BiFunction&lt;T, T, T&gt;를 extends <ul><li>apply : T 타입 두개를 받아서 T 타입을 리턴</li>|
| Consumer&lt;T&gt; | <ul><li>accept : T 타입을 받아서 동작 수행 (리턴 X)</li><li>andThen : 함수조합</li></ul> |
| Predicate&lt;T&gt; | <ul><li>test : T 타입을 받아서 boolean 리턴 </li><li>and : 함수조합</li><li>or : 함수조합</li><li>negate : 함수조합</li></ul> |
| Supplier&lt;T&gt; | <ul><li>get : T 타입의 값을 제공</ul> |
{{% /table %}}
</details>

<br/>

### 변수 캡쳐 (Variable Capture)
람다 표현식 함수 몸체에서 외부의 변수를 참조하는 것을 말한다.       
참조된 변수의 앞에는 `final`을 붙여야 하나 자바8에서 부터는 생략 가능하다. (effective final: `final`이 붙지 않을 경우 동시성 문제가 발생할 수 있기에 컴파일러가 방지한다.)

```java
public void run() {
    int number = 100;       //final 키워드 생략, number 변수는 람다식 내부에서 참조

    IntConsumer consumer = (base) -> System.out.println(base * number);

    consumer.accept(2);
}
```

<br/>

또한, 로컬 클래스와 익명 클래스에서는 쉐도잉이 발생하나 람다식에서는 쉐도잉이 발생하지 않는다.      
즉 로컬 클래스와 익명 클래스의 scope와 이를 감싸고 있는 scope는 다르지만, 람다식의 경우 람다식을 감싸고 있는 scope와 동일하다.
>**변수의 쉐도잉 (Variable Shadowing)**      
쉐도잉이란 하위 scope와 상위 scope에서 각각 동일한 이름의 변수가 존재할 때, 하위 scope에서 해당 이름을 가진 변수를 사용하게 되면 상위 scope의 변수는 가려져 하위 scope의 변수가 사용되는 것을 말한다.

```java
public void run() {
    int number = 100;
    
    // 로컬 클래스
    class LocalClass {
        void print() {
            int number = 1;
            System.out.println(number);     // 1이 출력
        }
    }
    
    // 익명 클래스
    Runnable anonymousClass = new Runnable() {
        @Override
        public void run() {
            int number = 2;
            System.out.println(number);     // 2가 출력
        }
    };
    
    // 람다식
    Runnable lambdaExpression = () -> {
        //int number = 3;                   // 불가능, 컴파일 에러 발생
        System.out.println(number);         // 100이 출력
    };
}
```

<br/>

### 메서드 레퍼런스

람다식을 직접 정의 할수도 있으나, 람다식이 단순히 특정 메서드나 생성자를 호출하는 것이라면 메서드 레퍼런스를 사용하여 간단히 표현할 수 있다.


#### 메서드 레퍼런스 사용법
| 유형 | 형식 |
|:-----|:------------|
| static 메서드 참조 | `타입::static 메서드 명` |
| 인스턴스 메서드 참조 | `참조 변수명::인스턴스 메서드 명` |
| 생성자 참조 | `타입::new 키워드` | 
| 임의 객체의 메서드 참조 | `타입::인스턴스 메서드 명` | 

이 중, 임의 객체의 메서드 참조는 인자로 전달되는 인스턴스를 특정하지 않는 경우에 사용한다.      
즉 , 함수 객체를 적용하는 시점에 인자로 들어오는 인스턴스를 알려주며 주로 스트림 파이프라인에서 매핑과 필터 함수에 사용된다.

아래의 코드는 메서드 레퍼런스 사용 예시이다.

```java

public class Sample() {
    public Sample() {
        ...
    }

    public Sample(String arg) {
        ...
    }


    public static String concatStatic(String str) {
        return str + "static";
    }

    public String concatInstance(String str) {
        return str + "instance";
    }
}

...

public void run() {
    // 람다식
    UnaryOperator<String> concat1 = string -> string + "someting";

    // static 메서드 레퍼런스
    UnaryOperator<String> concat2 = string -> Sample::concatStatic;     

    // static 인스턴스 레퍼런스
    Sample sample1 = new Sample();
    UnaryOperator<String> concat2 = string -> sample1::concatInstance;

    // 기본 생성자 레퍼런스
    Supplier<Sample> sample2 = Sample::new;

    // 인자있는 생성자 레퍼런스
    Function<String, Sample> sample3 = Sample::new;

    // 임의 객체의 메서드 참조
    String[] list = {"alpha", "beta", "gamma"};
    Arrays.sort(list, String::compareToIgnoreCase);
}
```

<br/><br/>

**1부 - 특징 및 람다 표현식**        
[**2부 - 스트림 API**]()      
[**3부 - java.time 패키지**]()        
[**4부 - 나즈혼(Nashorn)**]()     
[**5부 - 기타 변경사항**]()

<br/>

## References