FROM nginx:1.27-alpine3.21

# Copie des fichiers dans le répertoire nginx
COPY . /usr/share/nginx/html

# Copie de la configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Port exposé
EXPOSE 80