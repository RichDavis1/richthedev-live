FROM golang:alpine as builder

ENV CGO_ENABLED=0\
export GO111MODULE=on

RUN unset GOPATH
RUN CGO_ENABLED=0
RUN GO111MODULE=on
RUN mkdir /build 

WORKDIR /build
ADD . .

COPY go.mod .
COPY go.sum .

RUN go build .

FROM golang:alpine
WORKDIR /app
COPY --from=builder /build/richthedev-live /app
COPY --from=builder /build/.env /app/local.env 
COPY --from=builder /build/web/assets/public /app/web/assets/public 
COPY --from=builder /build/web/templates /app/web/templates  

WORKDIR /app
CMD ./richthedev-live
