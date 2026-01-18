---
title: Aprendre Go és divertit
date: 2026-01-10
status: published
---

# Per què    m'agrada Go

Go és un llenguatge de programació modern i eficient.

## Simplicitat

Go té una sintaxi molt neta i fàcil d'aprendre. No hi ha herència complexa ni característiques obscures.

![imatge](../images/img01.jpg)

## Rendiment

El codi compilat de Go és molt ràpid, gairebé tan ràpid com C o C++, però molt més fàcil d'escriure.

## Concurrència

Les goroutines fan que la programació concurrent sigui senzilla:

```go
go func() {
    fmt.Println("Això s'executa en paral·lel!")
}()
```

## Eines integrades

Go ve amb eines fantàstiques integrades:

- `go fmt` - Formateja el codi automàticament
- `go test` - Sistema de testing integrat
- `go mod` - Gestió de dependències
- `go build` - Compilació ràpida

Perfecte per crear eines com aquest generador de blogs!
