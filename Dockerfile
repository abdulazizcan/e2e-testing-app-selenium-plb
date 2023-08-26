# Node.js LTS sürümünü temel alarak bir imaj oluşturuluyor.
FROM node:lts

# Uygulamanın çalışacağı dizin belirleniyor.
WORKDIR /usr/src/app

# Tarayıcılar ve ilgili araçlar için gerekli olan paketlerin yüklenmesi
RUN apt-get update && apt-get install -y \
    firefox-esr \
    chromium \
    wget \
    unzip \
    xvfb \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Geckodriver'ın indirilmesi ve ayarlanması
RUN wget https://github.com/mozilla/geckodriver/releases/download/v0.29.1/geckodriver-v0.29.1-linux64.tar.gz \
    && tar -zxf geckodriver-v0.29.1-linux64.tar.gz -C /usr/local/bin \
    && rm geckodriver-v0.29.1-linux64.tar.gz

# Chromedriver'ın indirilmesi ve ayarlanması
RUN wget https://chromedriver.storage.googleapis.com/94.0.4606.41/chromedriver_linux64.zip \
    && unzip chromedriver_linux64.zip -d /usr/local/bin \
    && rm chromedriver_linux64.zip

# package.json ve package-lock.json dosyalarını kopyalıyoruz.
COPY package*.json ./

# Uygulamanın bağımlılıklarını yüklüyoruz.
RUN npm install

# Uygulamanın geri kalan dosyalarını kopyalıyoruz.
COPY . .

# Uygulamanın başlatılma komutu belirleniyor.
CMD ["npm", "start"]
