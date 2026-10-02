FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Os arquivos públicos ficam na raiz do repositório GitHub.
COPY index.html 404.html robots.txt sitemap.xml /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
COPY agente-ia/ /usr/share/nginx/html/agente-ia/
COPY whatsapp-robot/ /usr/share/nginx/html/whatsapp-robot/
COPY treinamento-especializado/ /usr/share/nginx/html/treinamento-especializado/
COPY sobre-nos/ /usr/share/nginx/html/sobre-nos/
COPY solucoes/ /usr/share/nginx/html/solucoes/
COPY solucoes-inteligentes-para-gestao-educacional/ /usr/share/nginx/html/solucoes-inteligentes-para-gestao-educacional/
COPY solucao-completa/ /usr/share/nginx/html/solucao-completa/
COPY contato/ /usr/share/nginx/html/contato/
COPY politica-de-privacidade/ /usr/share/nginx/html/politica-de-privacidade/
COPY wp-content/ /usr/share/nginx/html/wp-content/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
