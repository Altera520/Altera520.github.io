---
title: "[기술블로그 구축] Hugo에 algolia 적용하기"
date: 2021-02-18T02:54:12+09:00
draft: true
categories:
    - Etc
tags:
    - algolia
    - hugo
---

## 개요

블로그를 시작한 이유는 기억에만 의존하지 않기 위해서이다. 기억이라는 것이 반영구적이지 못하므로 기록을 남기는 것인데.. 추후 필요할때마다 찾아보기 위해서는 검색 기능이 무엇보다도 중요하다고 생각하였다.

검색 기능을 추가하기 위해 검토한 도구들은 다음과 같다.
1. **Algolia**
    - 검색을 위한 정보들이 저장되는 `index.json`의 동기화가 필요하다.
    - 사용법이 쉬우며 관리자 콘솔이 잘 만들어져 있다.
    - FREE의 경우 1 Unit당 1000 search requests, 1000 redcords
    - low bandwidth & high performance
1. **Lunr.js**
    - 검색을 위한 정보들이 저장되는 `index.json`의 동기화가 필요없다.
    - contentLength 제한이 없다.
    - high bandwidth & low performance

Algolia를 사용하기로 결정하였다.

Algolia 가입 및 Hugo 블로그 구축에 관한 기본적인 내용은 생략하며, 해당 포스트는 [Static site search with Hugo + Algolia](https://forestry.io/blog/search-with-algolia-in-hugo/) 게시물을 참고하여 작성하였다.

<br/>

## 수행 내용

### 1. 검색 인덱스 생성

#### config.toml 파일 설정

우선 `config.toml` 파일에 아래의 설정을 추가한다.

```toml
[outputFormats.Algolia]
baseName = "algolia"
isPlainText = true
mediaType = "application/json"
notAlternative = true

[params.algolia]
vars = ["title", "summary", "date", "publishdate", "expirydate", "permalink"]
params = ["categories", "tags"]
```

`[outputFormats.Algolia]` 설정 내용
- baseName: 
- isPlainText: golang의 일반 텍스트 파서를 사용하여 일부 자동 HTML 형식으로 인한 json 손상 방지
- mediaType: 
- notAlternative: 

`[params.algolia]` 설정 내용
- vars: 검색 인덱스에 포함할 페이지 변수 설정
- params: 검색 인덱스에 포함할 사용자 정의 페이지 매개 변수 설정

<br/>

#### `layouts/_default/list.algolia.json` 파일 생성
`layouts/_default/` 경로에 list.algolia.json 파일을 생성하고 아래의 내용을 붙여넣는다.         
꼭, list.algolia명으로 파일을 생성할 필요는 없다. 파일명에 config.toml에서 지정한 baseName이 포함되기만 하면된다.
```golang
{{/* Generates a valid Algolia search index */}}
{{- $.Scratch.Add "index" slice -}}
{{- $section := $.Site.GetPage "section" .Section }}
{{- range .Site.AllPages -}}
  {{- if or (and (.IsDescendant $section) (and (not .Draft) (not .Params.private))) $section.IsHome -}}
    {{- $.Scratch.Add "index" (dict "objectID" .UniqueID "date" .Date.UTC.Unix "description" .Description "dir" .Dir "expirydate" .ExpiryDate.UTC.Unix "fuzzywordcount" .FuzzyWordCount "keywords" .Keywords "kind" .Kind "lang" .Lang "lastmod" .Lastmod.UTC.Unix "permalink" .Permalink "publishdate" .PublishDate "readingtime" .ReadingTime "relpermalink" .RelPermalink "summary" .Summary "title" .Title "type" .Type "url" .URL "weight" .Weight "wordcount" .WordCount "section" .Section "tags" .Params.Tags "categories" .Params.Categories "authors" .Params.Authors)}}
  {{- end -}}
{{- end -}}
{{- $.Scratch.Get "index" | jsonify -}}
```

#### config.toml의 [outputs] 설정
[outputs] home에 "Algolia"를 추가한다.

```toml
[outputs]
home = ["HTML", "RSS", "Algolia"]
```

<br/>

### 2. Algolia 관리자 콘솔에서 인덱스 생성

<br/>

### 3. 생성한 검색 인덱스를 Algolia로 전송

우선 atomic-algolia NPM패키지를 설치한다.
```
npm install atomic-algolia --save
```

<br/>

블로그 루트 경로에서 `package.json`을 생성하고 아래의 실행 scripts 관련 내용을 추가해준다.

```json
{
    "scripts": {
        "algolia": "atomic-algolia"
    }
}
```

<br/>

블로그 루트 경로에 `.env` 파일을 생성하고 필히 `.gitignore`파일에 `.env`가 무시되게 포함시킨다.
```text
ALGOLIA_APP_ID={{ YOUR_APP_ID }}
ALGOLIA_ADMIN_KEY={{ YOUR_ADMIN_KEY }}
ALGOLIA_INDEX_NAME={{ YOUR_INDEX_NAME }}
ALGOLIA_INDEX_FILE=./public/algolia.json
```

<br/>

이후 hugo 커맨드를 통해 빌드하면 `public` 디렉토리 하위에 `algolia.json`파일이 자동 생성되며, 앞서 package.json에 포함해둔 "algolia" 스크립트를 통해 Algolia로 검색 인덱스를 전송할 수 있다.

```
hugo & npm run algolia
```

위의 명령을 수행하면 아래와 같이 관리자 콘솔에서 검색 인덱스가 추가된 것을 확인할 수 있다.

{{<image src="/images/2021-02-18-hugo-with-algolia/npm-run-algolia-result.png" width="100%" caption="추가된 검색 인덱스 내용">}}

<br/>

### 4. Algolia 콘솔에서 인덱스 설정
만약 검색 인덱스가 최초로 추가된 것이라면 관리자 콘솔에서 기본적인 설정을 완료할 필요가 있다.

<br/>

## 후기

기술블로그를 시작한 후, 미루고 미루다 Algolia를 통해 검색 기능을 추가해보았다. ~~이 놈의 귀차니즘~~     

하지만 아직까지는 해결해야할 문제점이 몇 개 보인다.
1. git commit 시 build 및 algolia로 인덱스 파일 수동 전송
1. 

<br/>

## References

- [https://forestry.io/blog/search-with-algolia-in-hugo/](https://forestry.io/blog/search-with-algolia-in-hugo/)