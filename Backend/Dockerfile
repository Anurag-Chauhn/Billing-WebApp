FROM eclipse-mosquitto:21-jre
WORKDIR /Project
COPY target/BillingSoftware-0.0.1-SNAPSHOT.jar billing-v1.0.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","billing-v1.0.jar"]