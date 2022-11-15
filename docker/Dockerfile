FROM scratch as build

ADD . /app
RUN rm -rf /app/.github /app/.vscode /app/docker /app/CNAME /app/docker-compose.* /app/.editorconfig

FROM nginx

RUN rm -r /usr/share/nginx/html && \
    ln -s /app/public /usr/share/nginx/html

COPY --from=build /app /app/public
ADD docker/nginx /etc/nginx
