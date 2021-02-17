---
title: "디자인 패턴별 분류"
date: 2021-01-20T21:35:23+09:00
draft: true
categories:
    - OOP
tags:
    - Java
    - Design Pattern
---

## 디자인 패턴 정의



디자인 패턴을 사용하면 아래와 같은 장점을 취할 수 있다.
- 재사용성, 확장성
- communication
- speed

**디자인 패턴을 무조건적으로 맹신하면 안된다.**     
즉, when, why, result를 따졌을 때 부합하여야 한다.

<br/>

## 디자인 패턴 분류

디테일하게까지 기억하는 것은 중요하지 않다.         
추후, 필요할 때마다 찾아보기 위해서 기록해놓는다.

<br/>

### 1. 기본(Fundamental) 패턴       
가장 기본인 동시에 중요한 패턴
| name | description |
|:-----|:------------|
|[델리게이션 (Delegation)](/posts/2021-01-20-delegation_pattern)| 객체의 일부 기능을 다른 객체에게 위임하는 패턴 |
|인터페이스 (Interface)||
|불변 (Immutable)||
|마커 인터페이스 (Marker Interface)||

### 2. 생성(Creational) 패턴
객체의 생성과정에 관여하는 패턴
| name | description |
|:-----|:------------|
| [싱글턴 (Singleton)](/posts/2021-01-06-singleton)| 객체가 오직 1개만 생성되어야 하는 경우에 사용하는 패턴|
| 빌더 (Builder)||
| 프로토타입 (Prototype)||
| 팩토리 메서드 (Factory Method)||
| 추상 팩토리 (Abstract Factory)||

### 3. 구조(Structural) 패턴
| name | description |
|:-----|:------------|
| 어댑터 (Adapter)||
| 브리지 (Bridge)||
| 컴퍼지트 (Composite)||
| 데코레이터 (Decorator)||
| 퍼사드 (Facade)||
| 플라이웨이트 (Flyweight)||
| 프록시 (Proxy)||

### 4. 행위(Behavioral) 패턴
객체간 책임을 할당하는 방법을 추상화
| name | description |
|:-----|:------------|
| 책임 연쇄 (Chain of Responsibility)||
| 커맨드 (Command)||
| 인터프리터 (Interpreter)||
| 이터레이터 (Iterator)||
| 미디에이터 (Mediator)||
| 메멘토 (Memento)||
| 옵저버 (Observer)||
| 스트래티지 (Strategy)||
| 스테이트 (State)||
| 템플릿 메서드 (Template Method)||
| 비지터 (Visitor)||

<br/>

## References

- [https://en.wikipedia.org/wiki/Software_design_pattern](https://en.wikipedia.org/wiki/Software_design_pattern)