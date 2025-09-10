FROM nginx:alpine

ARG ENV_MODE=dev
ENV ENV_MODE=${ENV_MODE}

RUN mkdir -p /etc/nginx/ssl/${ENV_MODE}
COPY ssl/${ENV_MODE}/server.cert /etc/nginx/ssl/${ENV_MODE}/server.cert
COPY ssl/${ENV_MODE}/server.key /etc/nginx/ssl/${ENV_MODE}/server.key
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
