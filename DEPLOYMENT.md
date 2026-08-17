# دليل نشر نظام مصلحة الضرائب على Windows Server

دليل خطوة بخطوة لرفع الموقع على سيرفر المصلحة (Windows Server) بحيث يعمل كموقع إنتاجي
على الإنترنت وعلى الشبكة الداخلية.

---

## 1) محتويات حزمة النشر `TaxITHub-deploy.zip`

- **الكود كاملاً** مع مجلد `vendor` (مكتبات PHP) والأصول الإنتاجية `public/build` — لا حاجة لـ Composer أو Node.js على السيرفر.
- لا يتضمن: `.env` (أسرار محذوفة عمداً)، `node_modules`، ملفات التطوير.

> إذا حدثت لاحقاً تعديلات على الكود، أعد بناء الحزمة أو انقل الملفات المحدثة فقط.

---

## 2) المتطلبات على السيرفر

| المكوّن | المطلوب |
|---|---|
| Windows Server | 2016 أو أحدث |
| PHP | 8.2 فما فوق (x64 **Thread Safe**) |
| MySQL | 5.7 أو 8.0 (أو MariaDB) |
| Apache | 2.4 (موصى به) أو IIS |

### 2.1 تثبيت PHP
1. حمّل PHP x64 Thread Safe من: `https://windows.php.net/download/`
2. فك الضغط إلى مجلد مثل `C:\php`
3. افتح `C:\php\php.ini-production` وانسخه باسم `php.ini`
4. فعّل الإضافات الضرورية في `php.ini` (أزل `;` أمامها):
   ```
   extension=curl
   extension=fileinfo
   extension=gd
   extension=intl
   extension=mbstring
   extension=openssl
   extension=pdo_mysql
   extension=mysqli
   extension=zip
   ```
5. أضف `C:\php` إلى `PATH` (إعدادات النظام → متغيرات البيئة).

تحقق من التثبيت:
```
php -v
php -m
```

### 2.2 تثبيت MySQL
1. ثبّت MySQL Server 8 وأنشئ قاعدة بيانات باسم `taxit_hub` بترميز `utf8mb4`:
   ```sql
   CREATE DATABASE taxit_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. سجّل اسم المستخدم وكلمة المرور في مكان آمن (ستدخلها في `.env`).

---

## 3) تثبيت المشروع

1. انسخ `TaxITHub-deploy.zip` إلى السيرفر وفك ضغطه في مجلد مثل:
   ```
   C:\inetpub\taxit
   ```
   بحيث يظهر هيكل مثل:
   ```
   C:\inetpub\taxit\public\index.php
   C:\inetpub\taxit\artisan
   C:\inetpub\taxit\.env.example
   C:\inetpub\taxit\.env.production.example
   ```

2. أنشئ ملف البيئة:
   ```
   copy .env.production.example .env
   ```
   ثم عدّل في `.env`:
   - `APP_URL` ← رابط الموقع (مثال `https://taxit.tax.gov.ly` أو عنوان IP الداخلي)
   - `DB_DATABASE=taxit_hub`
   - `DB_USERNAME` و `DB_PASSWORD` ← بيانات MySQL من الخطوة 2.2
   - اترك `APP_ENV=production` و `APP_DEBUG=false`

3. من داخل مجلد المشروع شغّل:
   ```
   php artisan key:generate
   php artisan migrate --force
   php artisan db:seed --force
   ```

   - `migrate` ينشئ جداول قاعدة البيانات.
   - `seed` يعبّئ الإدارات والمكاتب والأقسام ويُنشئ حسابات الدخول:
     - `admin@tax.gov.ly` / `password` (مدير النظام)
     - `viewer@tax.gov.ly` / `password` (مشاهد)
   - **بعد أول دخول غيّر كلمة مرور المدير فوراً.**

4. فك الارتباط بالبيئة التطويرية وتحسين الأداء:
   ```
   php artisan storage:link
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

---

## 4) إعداد Apache (الطريقة الموصى بها)

أضف `VirtualHost` في ملف إعدادات Apache `httpd-vhosts.conf`:

```apache
<VirtualHost *:80>
    ServerName taxit.local
    DocumentRoot "C:/inetpub/taxit/public"

    <Directory "C:/inetpub/taxit/public">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

- ملف `public/.htaccess` موجود مسبقاً داخل الحزمة (مطلوب لمسار Inertia و Laravel).
- أعد تشغيل Apache وافتح `http://taxit.local` من داخل الشبكة.
- أضف سطراً في `C:\Windows\System32\drivers\etc\hosts` على أجهزة الشبكة:
  ```
  192.168.x.x   taxit.local
  ```

### صلاحيات الكتابة (مهم جداً)
امنح مستخدم خدمة Apache (مثل `apache`) صلاحية تعديل على المجلدين:
```
C:\inetpub\taxit\storage
C:\inetpub\taxit\bootstrap\cache
```
(الملفات المرفوعة مثل PDF تخزن في `storage/app/private/documents`.)

---

## 5) البديل: IIS مع PHP

1. ثبّت IIS ثم "PHP Manager" أو اربط PHP بـ `FastCGI`.
2. وجه الموقع إلى `C:\inetpub\taxit\public` وجعل `index.php` هو المستند الافتراضي.
3. ثبّت **URL Rewrite** وانسخ قاعدة إعادة التوجيه (web.config) التي تقابل قواعد `.htaccess`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Laravel" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="index.php" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

4. امنح صلاحية الكتابة لـ `storage` و `bootstrap\cache` لحساب خدمة IIS (IUSR).

---

## 6) اختبار الموقع

- افتح الرابط → يجب ظهور صفحة الدخول.
- سجّل الدخول بحساب `admin@tax.gov.ly` وتحقق من:
  - صفحة المكاتب والأقسام.
  - إضافة سجل وتحميل ملف PDF.
  - فتح ملفات PDF (تُعرض داخل المتصفح لا تُحمَّل).
- افحص السجل للتحقق من عدم وجود أخطاء:
  ```
  C:\inetpub\taxit\storage\logs\laravel.log
  ```

---

## 7) تحديثات مستقبلية

عند تعديل الكود على جهاز التطوير:
1. أعد بناء الحزمة بنفس الطريقة (مع حذف `public/hot` قبل البناء).
2. على السيرفر: انسخ الملفات الجديدة فوق القديمة.
3. إذا تغيّرت الجداول: `php artisan migrate --force`
4. أعد بناء الكاش: `php artisan config:cache && php artisan route:cache && php artisan view:cache`

---

## ملاحظات أمان

- `APP_DEBUG` يجب أن يبقى `false` في الإنتاج.
- غيّر كلمة مرور المدير بعد أول تسجيل دخول.
- `public/hot` هو ملف خاص بوضع التطوير (Vite) — لا تنسخه أبداً من جهاز التطوير إلى السيرفر.
- لا ترفع ملف `.env` نهائياً إلى الإنترنت أو نظام التحكم بالنسخ.