---
title: "다익스트라 알고리즘"
date: 2020-12-24T09:20:18+09:00
draft: true
categories:
    - algorithm
tags:
    - dijkstra
---

## 다익스트라 알고리즘

특정노드에서 방문할 수 있는 모든 노드들간의 최단경로를 구하는 알고리즘이다.

```cpp
#include <iostream>
#include <vector>
#include <queue>
#define INF 1e9

using namespace std;

vector<int> table; //shortest path table
vector<vector<pair<int, int>>> map;

struct cmp{
    bool operator()(pair<int,int> &t, pair<int,int> &u){
        return t.second > u.second;
    }
};

void dijkstra(int start, int vertex){
    priority_queue<pair<int,int>, vector<pair<int,int>>, cmp> heap; //O(ElogV)

    fill(table.begin(), table.end() + 1, INF); // table init
    table[start] = 0;
    heap.push({start, 0}); //node, cost

    while(!heap.empty()){
        int current_node = heap.top().first;
        int current_cost = heap.top().second;

        heap.pop(); //O(logV)

        for(pair<int, int> next : map[current_node]){
            int next_node = next.first;
            int next_cost = next.second;
            int cost = table[current_node] + next_cost;

            if(table[next_node] > cost){
                table[next_node] = cost;
                heap.push({next_node, table[next_node]}); //node, cost
            }
        }
    }
}

int main() {
    int vertex, edge;
    cin >> vertex >> edge;

    map.resize(vertex + 1); //1 ~ vertex
    table.resize(vertex + 1);

    for(int i=1; i <= edge; i++){
        int from, to, cost;
        cin >> from >> to >> cost;

        map[from].push_back({to, cost}); //node, cost
    }

    dijkstra(1, vertex); //1번 부터 시작
}
```
