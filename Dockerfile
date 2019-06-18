FROM 172.16.2.182:5000/nginx:1.17.0
  

ADD ./dist /usr/share/nginx/html

ENV TZ=Asia/Shanghai

EXPOSE 80

