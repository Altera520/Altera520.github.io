---
title: "예외(Exception) 처리 전략"
date: 2021-01-30T17:12:08+09:00
draft: true
categories:
    - Programming
tags:
    - Java
---

## Error와 Exception

예외처리에 대해 살펴보기 전에 우선, Exception과 Error의 차이를 정리하고 넘어가고자 한다.

- **에러(Error)** :         
    시스템에 무엇인가 비정상적인 상황이 생겼을 때 발생한다.         
    에러는 시스템 레벨에서 발생하며 개발자가 예측하여 처리할 수 없으므로        
    **애플리케이션에서 에러 처리를 신경쓰지 않아도 된다.**

- **예외(Exception)** :         
    예외는 개발자가 구현한 로직에서 발생하며 정상적인 프로그램 흐름을 벗어나는 것이다.      
    **예외는 발생할 수 있는 상황을 미리 예측하여 처리가능하다.**

<br/>

## 예외 구분

예외는 `Checked Exception`과 `Unchecked Exception`으로 구분되며 이 둘의 큰 차이는 처리방식에 있다.        
hierarchy에 나와있듯이 Runtime Exception을 상속한 예외 클래스들은 Unchecked Exception으로 분류된다.

{{<image src="/images/2021-01-30-exception/throwable-hierarchy.jpg" width="65%" caption="Throwable hierarchy (출처: programmersought.com/article/21334604587/)">}}

| 구분 | Checked Exception | Unchecked Exception |
|:-----|:------|:------|
| 확인 시점 | 컴파일 시점 | 런타임 시점 |
| 처리 여부 | 반드시 예외 처리 해야함 | 명시적인 처리를 강제하지 않음 |
| 트랜잭션 처리 | 롤백(rollback)하지 않음 | 롤백(rollback) 해야 함 |

<br/>

## 예외처리 방법

예외처리 방법은 3가지로 분류되며 상황에 따라서 적절한 처리 방식을 사용해야 한다.        
또한 간단한 조건문으로 수행할 수 있는 로직은 예외를 사용해 처리하지 말아야하며,         
예외는 먹는 것이 아니기에 삼키면 안된다.

### 예외 복구

**예외 상황을 파악하고 문제를 해결하여 정상적인 상태로 되돌려 놓는 방법이다.**

```java
final int MAX_RETRY = 100;
public Object someMethod() {
    int maxRetry = MAX_RETRY;
    while(maxRetry > 0) {
        try {
            ...
        } catch(SomeException e) {
            // 로그 출력. 정해진 시간만큼 대기한다.
        } finally {
            // 리소스 반납 및 정리 작업
        }
    }
    // 최대 재시도 횟수를 넘기면 직접 예외를 발생시킨다.
    throw new RetryFailedException();
}
```

<br/>

### 예외처리 회피

**예외 처리를 직접 처리하지 않고 호출한 쪽으로 던지는 방법이다.**       

예외처리 회피시 무책임하게 상위 메서드로 예외를 던지는 것은 상위 메서드들의 책임이 증가하므로 지양해야한다. 

```java
/* 예시 1번 */
public void add() throws SQLException {
    // ...
}

/* 예시 2번 */
public void add() throws SQLException {
    try {
        // ...
    } catch(SQLException e) {
        throw e;
    }
}
```

<br/>

### 예외 전환

**예외 회피와 비슷하나 바로 던지는 것이 아닌 적절한 예외로 전환시켜 던지는 방법이다.**

```java
// 조금 더 명확한 예외로 던진다.
public void add(User user) throws DuplicateUserIdException, SQLException {
    try {
        // ...생략
    } catch(SQLException e) {
        if(e.getErrorCode() == MysqlErrorNumbers.ER_DUP_ENTRY) {
            throw DuplicateUserIdException();
        }
        else throw e;
    }
}

// 예외를 단순하게 포장한다.
public void someMethod() {
    try {
        // ...생략
    }
    catch(NamingException ne) {
        throw new EJBException(ne);
        }
    catch(SQLException se) {
        throw new EJBException(se);
        }
    catch(RemoteException re) {
        throw new EJBException(re);
        }
}
```


<br/>

## Spring에서 예외 처리

일반적으로 예외는 try-catch나 상위 메서드로 예외처리를 위임하여 처리한다. 하지만 이 경우 비즈니스 로직과 예외 처리를 하는 코드가 섞이게되고 복잡해져 유지보수가 힘들어진다.     

이러한 문제를 완충하기 위해 `@ExceptionHandler`, `@ControllerAdvice`를 사용한다.

## References

- [MadPlay님의 블로그 - 자바 예외 구분](https://madplay.github.io/post/java-checked-unchecked-exceptions)