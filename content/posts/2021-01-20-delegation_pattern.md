---
title: "위임(Delegation) 패턴"
date: 2021-01-20T21:21:47+09:00
draft: true
categories:
    - OOP
tags:
    - Java
    - Design Pattern
---

## Delegation 패턴 정의

**객체의 일부 기능을 다른 객체(helper)에게 위임하는 패턴이다.**

상속에 비했을 때 확장이 유연하며 사용 이유는 다음과 같다.
1. 런타임중에 기능의 교체가 필요한 경우
1. 여러 클래스에서 공통되는 메소드를 줄이기 위해

Decorator, Proxy, Strategy 패턴 등에서 기본이된다.

<br/>

## Delegation 패턴 구성

Delegation 패턴을 적용한 코드를 첨부한다.

### 런타임중에 기능의 교체

```java
interface PrinterDriver{
    void print();
    void insert();
}

class HpPrinterDriver implements PrinterDriver {
    public void print() {
        System.out.println("Hp print");
    }

    public void insert(){
        System.out.println("Hp insert");
    }
}

class SamsungPrinterDriver implements PrinterDriver {
    public void print() {
        System.out.println("samsung print");
    }

    public void insert(){
        System.out.println("samsung insert");
    }
}

class PrinterDriverService implements PrinterDriver {
    private PrinterDriver[] printerDrivers = {
        new SamsungPrinterDriver(), 
        new HpPrinterDriver()
    };

    private int selected = 0;

    public void print() {                   // print 기능 위임
        printerDrivers[selected].print();
    }

    public void insert(){                   // insert 기능 위임
        printerDrivers[selected].insert();
    }

    public void switchDriver(){
        selected = (selected + 1) % printerDrivers.length;
    }
}

public class Main {
    public static void main(String[] args){
        PrinterDriverService controller = new PrinterDriverService();

        controller.print();
        controller.insert();

        controller.switchDriver();      // SamsungPrinterDriver에서 HpPrinterDriver로 교체

        controller.print();
        controller.insert();
    }
}
```

<br/>

## References

- [https://en.wikipedia.org/wiki/Delegation_pattern](https://en.wikipedia.org/wiki/Delegation_pattern)
- [https://www.slideshare.net/madvirus/1-delgationstrategy-presentation?type=powerpoint](https://www.slideshare.net/madvirus/1-delgationstrategy-presentation?type=powerpoint)