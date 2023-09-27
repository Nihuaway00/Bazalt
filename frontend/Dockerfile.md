FROM next:latest
WORKDIR .
COPY . .
RUN npm install
EXPOSE 8000
CMD ["next", "start"]
