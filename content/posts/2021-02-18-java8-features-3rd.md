---
title: "[Java8의 변경사항] 3. 날짜와 시간 계산"
date: 2021-02-18T13:22:25+09:00
categories:
    - Programming
tags:
    - Java
---

## 자바8 이전의 날짜 클래스

자바8 이전에 사용하던 `java.util.Date`와 `java.util.Calendar` 등은 많은 문제점이 존재하였다. 대표적인 문제점을 추리면 다음과 같다.

1. 불변성(Immutable)을 보장하지 않는다. 불변성을 보장하지 않기에 Thread-safe하지 않다.
    ```java
    Calendar calendar = Calendar.getInstance();
    calendar.set(Calendar.Month, 2 - 1);

    Date date = new Date();
    date.setTime(new Date());
    ```
1. 클래스 이름이 Date인데 시간까지 다룬다.
1. int 상수 필드의 남용
1. Date와 Calendar의 불편한 역할 분담
1. Month 계산이 혼동스럽다. (1월을 나타내는 상수 값이 0부터 시작한다)
    ```java
    // 1월이 아닌 2월이 된다.
    calendar.set(Calendar.Month, 1); 

    // 1월을 표시하기 위해서는 상수 값 0이나 
    // Calendar에서 제공하는 static 필드를 사용해야 한다.
    calendar.set(Calendar.Month, Canlendar.JANUARY); 
    ```
1. `java.util.Date` 하위 클래스의 문제
    - `java.util.Date`를 상속한 클래스는 `java.sql.Date`와 `java.sql.Timestamp`가 있다.        
    - `java.sql.Date`의 경우 Comparable 인터페이스에 대한 정의를 클래스 선언에서 하지 않아 Comparable과 관련한 선언들을 복잡하게 만들었으며, `java.sql.Timestamp`는 equals() 선언의 대칭성을 위반하였다.<sup>[[1]](#footnote_1)</sup>

<br/>

위에 언급된 대표적인 문제점 말고도 많은 문제점들이 존재한다. 자바 8부터는 개선된 날짜 및 시간 관련 클래스들을 제공하니 시간처리와 관련된 기능들을 다룰 때 가능하면 최대한 자바 8의 날짜 및 시간 관련 클래스들을 활용하자.


<br/>

## 자바8의 Date-Time API

자바 8에서는 `java.time`패키지에 `LocalDateTime`과 `ZonedDateTime`등을 추가하여 이전보다 향상된 날짜와 시간계산 기능을 가능하게 하였다.

[JSR-310 스펙](https://jcp.org/en/jsr/detail?id=310)으로 구현된 Date Time API는 아래의 디자인 철학을 가진다.
- Clear
- Fluent
- Immutable
- Extensible

<br/>

### 인류용 시간(human time)

```
|------------------------ZonedDateTime------------------------|
|---------------OffsetDateTime---------------|
|--------LocalDateTime--------|
|--LocalDate--|---LocalTime---|--ZoneOffset--|---ZoneRegion---|
  2021-02-18      13:00:00        +09:00         Asia/Seoul
```

인류용 시간은 연, 월, 일, 시, 분, 초 등을 표현하며 인간이 쉽게 사용하고 읽을 수 있는 시간 형식을 말한다.    

> `LocalDateTime`, `LocalDate`, `LocalTime`은 서버 배포시 서버가 실행되는 국가에 따라 시간이 자동 세팅되므로 유의해야한다. 따라서 국내에서 서비스 한다면 LocalDateTime으로 처리하고, 글로벌 서비스까지 한다면 timezone이 추가된 `ZonedDateTime` 사용을 고려해야 한다.

<details open>
    <summary><strong>human time 관련 클래스</strong></summary>
{{% table "100%" %}}
| name | description |
|:-----|:------------|
|`LocalDate`, `LocalTime`, `LocalDateTime`| 시간대 정보(Zone Offset, Zone Region)가 포함되지 않은 클래스이다. <ul><li>**LocalDate**: 특정 날짜</li><li>**LocalTime**: 특정 시간</li><li>**LocalDateTime**: 일시</li></ul>|
|`ZoneOffset` | UTC 기준으로 시간(Time Offset)을 나타낸 것이다.<br/>ZoneOffset은 ZoneId를 상속한다.|
|`ZoneRegion`| Time Zone을 나타낸 것이다. 예시로 한국의 경우 KST는 타임존의 이름이며 이에 대응되는 ZoneRegion은 Asia/Seoul이다. <br/> ZoneRegion은 ZoneId를 상속하나 public 클래스가 아니므로 ZoneId를 통해서만 생성 가능하다.|
|`OffsetDateTime`| **LocalDateTime**에 **ZoneOffSet**의 정보까지 붙은 클래스이다.|
|`ZonedDateTime`| **OffsetDateTime**에 **ZoneRegion**의 정보까지 붙은 클래스이다.|
{{% /table %}}

ZoneOffset과 ZoneRegion을 보면 차이가 없어보인다. 하지만, API를 설계할 때 아무 이유없이 차이도 없는 클래스를 두개나 정의하지 않았을 것이다. 둘의 차이는 Time Transition Rule<sup>[[2]](#footnote_2)</sup>을 포함하는지 포함하지 않는지에 따라 다르다.
- `ZoneOffset`: Time Transition Rule을 포함하지 않는 ZoneRules를 가진다.
- `ZoneRegion`: Time Transition Rule을 포함할 수도 있고 포함하지 않을 수도 있다.

</details>


<br/>

### 기계용 시간(machine time)
기계용 시간이란 UTC 기준으로 EPOCH (1970년 1월 1일 0시 0분 0초)부터 현재에 이르기까지의 타임스탬프를 말한다. 즉, 인간이 읽고 쓰기에는 적합하지 않으나 기계에서 사용하기에는 적합한 시간을 의미한다.

많은 개발자들이 Long 타입 UNIX Timestamp를 사용한다. 타임스탬프 사용 이유로는 정수형을 이용한 정렬 및 기타 연산등에서 다른 타입보다 빠른 연산속도를 가지기 때문이다.        
하지만, UNIX Timestamp의 경우 [Year 2038 problem](https://en.wikipedia.org/wiki/Year_2038_problem)을 가지고 있기에 자바8에서는 Timestamp의 문제를 해결하기 위해 `Instant` 클래스를 추가하였다.      

<details>
    <summary>Instant 사용예시</summary>

#### 현재 시간의 타임스탬프 값 구하기

```java
Instant current = Instant.now();
long epochSecond = current.getEpochSecond();
long epochMilli = current.toEpochMilli();
```

#### Instant to ZonedDateTime/ ZonedDateTime to Instant

```java
// Instant to ZonedDateTime
Instant instant = Instant.now();
ZonedDateTime krTime = instant.atZone(ZoneId.of("Asia/Seoul"));

// ZonedDateTime to Instant
ZonedDateTime krTime = ZonedDateTime.of(2020, 8, 18, 6, 57, 38, ZoneId.of("Asia/Seoul"));
Instant instant = krTime.toInstant();
```

#### Instant to LocaldDateTime/ LocalDateTime to Instant

```java
// Instant to LocalDateTime
Instant instant = Instant.now();
LocalDateTime localDateTime = LocalDateTime.ofInstant(instant, ZoneOffset.UTC);

// LocalDateTime to Instant
LocalDateTime localDateTime = LocalDateTime.of(2020, 8, 18, 6, 57, 38);
Instant instant = localDateTime.toInstant(ZoneOffset.UTC);
```

### 기타 유용한 메서드들

Instant는 초 또는 밀리초 단위로 시간을 더하거나 빼는 메서드 및 비교하는 메서드 등을 제공

```java
Instant instant = Instant.now();

instant.plusSeconds(10);
instant.minusSeconds(10);

instant.isBefore(Instant.now());
instant.isAfter(Instant.now());
```

</details>

<br/>

### 기간의 표현

자바8에서 추가된 time 패키지 내에는 기간을 표현하기 위한 `Duration`과 `Period`가 존재한다.

#### Duration (시간 기반)

`Duration`은 **두 시간 사이의 간격을 초나 나노초 단위**로 나타내기 위해 사용한다.

<details>
    <summary>Duration 사용예시</summary>

```java
LocalTime startTime = LocalTime.of(11, 23, 40);
LocalTime endTime = LocalTime.of(11, 24, 50, 800);

Duration duration = Duration.between(startTime, endTime);

long sec = d.getSeconds();
long nano = d.getNano();
```
</details>

<br/>

#### Period (날짜 기반)

`Period`는 **두 날짜 사이의간격을 년, 월, 일 단위**로 나타내기 위해 사용한다.

<details>
    <summary>Period 사용예시</summary>

```java
LocalDate startDate = LocalDate.of(2014, 3, 1);
LocalDate endDate = LocalDate.of(2015, 4, 5);

Period p = Period.between(startDate, endDate);

int year = p.getYears();
int month = p.getMonths();
int day = p.getDays();
```
</details>

<br/>

#### ChronoUnit

`ChronoUnit`을 사용하면 `Duration` 또는 `Period` 객체 생성 없이 날짜 및 시간의 간격을 표현할 수 있다.

<details>
    <summary>ChronoUnit 사용예시</summary>

```java
LocalTime startTime = LocalTime.of(11, 23, 40);
LocalTime endTime = LocalTime.of(11, 24, 50, 800);

long hours = ChronoUnit.HOURS.between(startTime, endTime);
long minutes = ChronoUnit.MINUTES.between(startTime, endTime);
long seconds = ChronoUnit.SECONDS.between(startTime, endTime);

LocalDate startDate = LocalDate.of(2014, 3, 1);
LocalDate endDate = LocalDate.of(2015, 4, 5);

long months = ChronoUnit.MONTHS.between(startDate, endDate);
long weeks = ChronoUnit.WEEKS.between(startDate, endDate);
long days = ChronoUnit.DAYS.between(startDate, endDate);
```
</details>

<br/>

## JDBC에서의 컨버팅 및 Legacy에서 마이그레이션

자바8 이상의 버전이 되면서 자바8 이전에 사용되던 Date, Timestamp등은 레거시가 되었다.       
자바의 시간관련 타입들을 적절하게 사용하기위해서 기록해둔다.

<br/>

### JDBC에서의 컨버팅 형태

JDBC에서는 Java와 DB 스키마 사이에서 타입 컨버팅을 아래에 따라 자동 변환 시킨다.

{{<image src="/images/2021-02-18-java8-features-3rd/java-to-scheme.png" width="100%" caption="JDBC Converting">}}

### Legacy에서 마이그레이션시 권장 타입

{{<image src="/images/2021-02-18-java8-features-3rd/legacy-migration.png" width="100%" caption="Legacy Migration">}}

<br/><br/>

[**1부 - 특징 및 람다 표현식**]()        
[**2부 - 스트림 API**]()      
**3부 - java.time 패키지**        
[**4부 - 나즈혼(Nashorn)**]()     
[**5부 - 기타 변경사항**]()

<br/>

## footnote        
<a name="footnote_1">[1]</a> Date 타입과 TimeStamp 타입을 섞어 쓰면 a.equals(b)가 true라도 b.equals(a)는 false인 경우가 생길 수 있다.         
<a name="footnote_2">[2]</a> Time Transition Rule이란 [일광 절약 시간제(DST, Daylight Saving Time)](https://en.wikipedia.org/wiki/Daylight_saving_time)와 같이 표준시를 부분 조정하는 규칙을 말한다.

<br/>

## References

- [https://www.daleseo.com/java8-duration-period/](https://www.daleseo.com/java8-duration-period/)
- [https://madplay.github.io/post/java8-date-and-time](https://madplay.github.io/post/java8-date-and-time)
- [https://perfectacle.github.io/2018/09/26/java8-date-time/](https://perfectacle.github.io/2018/09/26/java8-date-time/)
- [https://stackoverflow.com/questions/32437550/whats-the-difference-between-instant-and-localdatetime](https://stackoverflow.com/questions/32437550/whats-the-difference-between-instant-and-localdatetime)
- [https://d2.naver.com/helloworld/645609](https://d2.naver.com/helloworld/645609)
- [https://umbum.dev/922](https://umbum.dev/922)