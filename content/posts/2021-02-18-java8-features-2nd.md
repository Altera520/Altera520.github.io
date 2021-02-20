---
title: "[Java8의 변경사항] 2. 스트림(Stream) API"
date: 2021-02-18T02:39:19+09:00
categories:
    - Programming
tags:
    - Java
    - Stream
---

## 스트림 특징
스트림 API는 **컬렉션과 같이 연속된 데이터를 처리하는 용도로 사용**한다. 저장하는 용도로 사용하는 것이 아니다.

스트림의 특징은 다음과 같다.
1. for과 같은 외부반복자와 필터링을 위한 if등을 사용하지 않아 직관적이며 가독성이 좋아진다.
    ```java
    //자바8  이전의 코드
    List<String> list = Arrays.asList("a", "b", "c");
    Iterator<String> iterator = list.iterator();
    while(iterator.hasNext()) {
        String item = iterator.next();
        System.out.println(item);
    }

    //자바 8 이후 코드
    List<String> list = Arrays.asList("a", "b", "c");
    Stream<String> stream = list.stream();
    stream.forEach(item -> System.out.println(item));
    ```


1. 최종 연산을 적용하면 스트림이 닫히고, 닫힌 스트림은 재사용이 불가능하다.
1. 병렬(Parallel) 스트림을 사용가능하다. 병렬 스트림은 여러 스레드가 나누어 작업한다.<sup>[[1]](#footnote_1)</sup><sup>[[2]](#footnote_2)</sup>       
    ```java
    List<String> list = Arrays.asList("a", "b", "c", "d", "e");
    Stream<String> parallelStream = list.parallelStream();

    parallelStream.forEach(item -> System.out.println(item));
    ```
1. 중개 연산은 미리하지 않으며 터미널 연산이 적용될 때 연산을 전체적으로 처리한다. (지연 연산)

<br/>

정리하자면 스트림은 Iterator와 비슷하나, 스트림을 사용하면 코드를 간결하게 작성할 수 있을뿐더러 내부 반복자를 사용하므로 병렬처리가 쉽다는 장점이 존재한다.

<br/>

## 스트림 사용법

스트림의 사용은 3단계로 나뉜다. (스트림 생성 → 중개 연산 → 최종 연산)


### 스트림 생성

#### 1. 배열 스트림
`Arrays.stream` 메서드를 사용하여 생성한다.
```java
String[] arr = new String[]{"1", "2", "3"}
Stream<String> stream = Arrays.stream(arr);
```

#### 2. 컬렉션 스트림
컬렉션의 경우 인터페이스에 추가된 `stream` 메서드를 사용하여 생성한다.
```java
List<String> list = Arrays.asList("1", "2", "3");
Stream<String> stream = list.stream();
```

#### 3. 비어있는 스트림
`Stream`의 `empty` 메서드를 사용하여 빈 스트림을 생성할 수 있다.
```java
Stream<String> stream = Stream.<String>empty();
```

#### 4. builder 메서드 사용
`Stream`의 `builder` 메서드를 사용하여 스트림을 직접적으로 생성할 수 있다.
```java
Stream<String> stream = 
    Stream.<String>builder()
        .add("a")
        .add("b")
        .build();
```

#### 5. generate 메서드 사용
`Stream`의 `generate` 메서드를 사용하여 `Supplier` 타입의 인자로 스트림을 생성 가능하다.      
이 경우 생성되는 스트림의 크기가 정해져 있지 않기에 `limit`로 스트림 사이즈를 지정해야한다.
```java
Stream<String> stream = 
    Steam.generate(() -> "st")
        .limit(10);
```

#### 6. 기본 타입 스트림
`Stream<Integer>`와 같이 제네릭을 사용하여 스트림을 생성할 수 있으나 기본타입의 스트림을 생성하는 경우 오토박싱이 발생한다. 오토박싱을 발생안하게 하려면 제네릭 타입의 스트림 사용 대신 `IntStream`, `LongStream`, `DoubleStream`을 사용하여 기본형 스트림을 생성 가능하다.     
```java
IntStream intStream = IntStream.range(1, 5); // [1, 2, 3, 4]
LongStream longStream = LongStream.rangeClosed(1, 5); // [1, 2, 3, 4, 5]
```
- `range`: 두번째 인자 값 이전까지 스트림을 생성한다.
- `rangeClosed`: 두번째 인자 값까지 스트림을 생성한다.

#### 7. 문자열 스트림
문자열의 `chars` 메서드를 통해 `IntStream`을 생성할 수 있다.
```java
IntStream intStream = "abcdefg".chars();
```

#### 8. 파일 스트림
`Files` 클래스의 `lines` 메서드를 통해 파일의 각 라인을 문자열 타입의 스트림으로 생성할 수 있다.
```java
Stream<String> fileStream = 
    Files.lines(Paths.get("sample.txt"), 
              Charset.forName("UTF-8"));
```

#### 9. 병렬 스트림
```java
Stream<String> streamOfList = list.parallelStream(); // 병렬 스트림 생성
Stream<String> streamOfArray = Arrays.stream(arr).parallel(); // 배열을 통한 병렬 스트림

streamOfList.isParallel() // 병렬 스트림 여부 확인
streamOfList.sequential(); // 시퀀셜 모드로 돌리기 위해 사용
```

#### 10. 스트림 연결
`Stream`의 `concat` 메서드를 사용하여 스트림을 연결하여 새로운 스트림을 생성할 수 있다.
```java
IntStream stream1 = IntStream.range(1, 5);
IntStream stream2 = IntStream.range(5, 10);
IntStream concatedStream = IntStream.concat(stream1, stream2);
```

<br/>

### 중개 연산

중개 연산은 `Stream`객체를 리턴하기에 다양한 중개 메서드를 chaining하여 작성이 가능하다.        
추가로, **중개 연산은 최종 연산이 적용되기 전까지 지연된다.**         
최종 연산이 적용될 때 중개 연산들을 일괄처리함으로써 미리 계산하면서 두 번 순회하는 불필요한 동작을 하지 않고 최종적으로 한번만 순회하며 데이터를 처리할 수 있다는 장점을 가진다.

<details open>
    <summary>중개 연산 종류</summary>
{{% table "100%" %}}
| name | description |
|:-----|:------------|
| filter | 스트림 내 요소들을 하나씩 조회하여 필터링하는 작업이다.<br/> 인자로 `boolean` 타입을 리턴하는 식이 들어가야 한다. |
| distinct | 요소 중복 제거 작업을 수행한다. |
| map | 스트림 내 요소들을 하나씩 특정 값으로 변환한다. |
| flatMap | 중첩 구조를 한 단계 제거하고 단일 컬렉션으로 만들어주는 역할을 수행한다.(flattening) <br/> 인자로 `Stream` 타입을 리턴하는 식을 넣어야한다. |
| sorted | 일반적인 정렬과 마찬가지로 `Comparator`을 인자로 사용한다. 만약 인자 없이 호출할 경우 기본적으로 오름차순으로 정렬한다. |
| peek | 단순히 스트림 내 요소들을 확인하기 위해 사용한다. 즉, 특정 결과를 반환하지 않는다. |
{{% /table %}}
</details>

<br/>

### 최종 연산

스트림을 끝내는 터미널 단계이며, 가공한 스트림에 대한 결과를 반환한다.      
**최종 연산이 수행된 이후에는 스트림이 닫히게 되어 더 이상 사용할 수 없다.**

<details open>
    <summary>최종 연산 종류</summary>
{{% table "100%" %}}
| name | description |
|:-----|:------------|
| count | 요소의 갯수를 계산한다. 스트림이 비어있는 경우 0이 반환된다. |
| sum | 요소의 합을 계산한다. 스트림이 비어있는 경우 0이 반환된다. |
| min | 요소 중 최솟값을 표현한다. <br/> 스트림이 비어있는 경우는 표현하지 못하므로 `Optional` 타입으로 반환된다. |
| max | 요소 중 최대값을 표현한다. <br/> 스트림이 비어있는 경우는 표현하지 못하므로 `Optional` 타입으로 반환된다. |
| average | 요소들의 평균값을 표현한다. <br/> 스트림이 비어있는 경우는 표현하지 못하므로 `Optional` 타입으로 반환된다. |
| ifPresent | 스트림에서 `Optional`을 처리하기 위해 사용한다. min, max, average와 연계된다. |
| reduce | 스트림 처리결과를 나타내기 위해 사용한다. reduce 메서드는 세 종류의 파라미터를 받을 수 있다. <ul><li>`accumulator`: 스트림의 각 요소가 들어올 때마다 중간 결과를 생성하는 식</li><li>`identity`: 스트림 계산을 위한 초기값. 계산할 값이 없더라도 해당 값은 리턴된다.</li><li>`combiner`: 병렬 스트림에서 나누어 계산한 결과를 하나로 합치는 식</li></ul> |
| collect | `Collector` 타입의 인자를 받아서 처리한다. 주로 사용되는 작업은 `Collectors` 클래스에서 제공한다. |
| anyMatch | 하나라도 조건을 만족하는 요소가 있는지 검사한다. `Predicate`타입을 인자로 받는다. |
| allMatch | 모두 조건을 만족하는지 검사한다. `Predicate`타입을 인자로 받는다. |
| noneMatch | 모두 조건을 만족하지 않는지 검사한다. `Predicate`타입을 인자로 받는다. |
| forEach | 모든 요소를 순회하며 실행한다. peek와 유사하나 최종작업이다. |
{{% /table %}}
</details>

<br/>

<details open>
    <summary>Collectors에서 제공하는 작업</summary>
{{% table "100%" %}}
| name | description |
|:-----|:------------|
| toList | 스트림 작업 결과를 리스트로 반환한다. |
| joining | 스트림에서 작업한 결과를 문자열로 이어 붙인다. joining 메서드는 세 종류의 인자를 받을 수 있다. <ul><li>`delimiter`: 각 요소를 구분시켜주는 구분자</li><li>`prefix`: 문자열 앞에 붙는 접두사</li><li>`suffix`: 문자열 뒤에 붙는 접미사</li><ul/> |
| averagingInt | 평균값을 산출해낸다. |
| summingInt | 합을 산출해낸다. |
| summarizingInt | 평균값, 합 둘다 산출해낸다. `IntSummaryStatistics`타입의 객체를 리턴한다. |
| groupingBy | `Function` 타입의 인자를 받아 요소들을 그룹핑하는데 사용한다. |
| partitioningBy | `Predicate` 타입의 인자를 받아 true, false 기준으로 나눈다. |
| collectingAndThen | 결과를 collect한 이후 `Collector`타입을 반환하는 추가 작업을 수행하기 위해 사용한다. |
| of | Collectors에서 기본 제공하는 작업 이외의 작업이 필요한 경우 새로운 유형의 작업을 정의하기 위해 사용한다. 사용하는 인자는 reduce 메서드에서 사용하는 인자와 동일하다. |
{{% /table %}}
</details>

<br/>

## footnote

<a name="footnote_1">[1]</a> 애플리케이션에서 사용하는 스레드가 많거나 스트림을 위해 사용하는 컬렉션의 요소가 적다면 병렬 스트림을 사용하는데 오버헤드가  더 클 수 있다.         
<a name="footnote_2">[2]</a> 자바에서는 병렬처리를 위해 [ForkJoinPool 프레임워크](http://tutorials.jenkov.com/java-util-concurrent/java-fork-and-join-forkjoinpool.html)를 사용한다.

<br/>

## Related Posts

<br/>

## References

- [https://futurecreator.github.io/2018/08/26/java-8-streams/](https://futurecreator.github.io/2018/08/26/java-8-streams/)