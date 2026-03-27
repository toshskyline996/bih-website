import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, CheckCircle, AlertTriangle, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { provinces, getCitiesByProvince } from '@/data/canada-locations';
import { SEO } from '@/components/seo/SEO';

/**
 * 联系页面 /contact
 * 
 * Netlify Forms 集成：
 * - form name="contact" + data-netlify="true"
 * - 隐藏 input name="form-name" 让 Netlify 识别
 * - 提交后显示前端感谢页（不跳转）
 * 
 * 级联下拉：省 → 市
 */

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function ContactPage() {
  const { t } = useTranslation();

  /* 表单状态 */
  const [status, setStatus] = useState<FormStatus>('idle');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  /* 省份变化时重置城市 */
  const handleProvinceChange = (code: string) => {
    setSelectedProvince(code);
    setSelectedCity('');
  };

  /* 当前省的城市列表 */
  const cities = selectedProvince ? getCitiesByProvince(selectedProvince) : [];

  /* Netlify Forms 提交处理 */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
        setSelectedProvince('');
        setSelectedCity('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  /* 表单字段通用样式 */
  const inputClass =
    'w-full border border-bih-gray-200 bg-white px-4 py-3 text-sm text-bih-dark placeholder:text-bih-gray-400 focus:border-bih-yellow focus:outline-none';
  const labelClass = 'block text-xs font-black uppercase tracking-wider text-bih-navy mb-1.5';

  return (
    <>
      <SEO
        title="Contact Us — Get a Quote"
        description="Contact Boreal Iron Heavy for product inquiries, compatibility checks, or custom quotes. Factory-direct heavy equipment attachments shipped across Canada. Response within 24 hours."
        keywords="excavator attachment quote Canada, heavy equipment contact Ontario, factory direct quote"
        canonical="/contact"
      />

      {/* ===== Hero ===== */}
      <section className="bg-bih-navy py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="text-3xl font-black uppercase tracking-tight text-white lg:text-5xl">
            {t('nav.contact')}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      <section className="bg-bih-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_360px]">

            {/* ===== 左侧：表单 ===== */}
            <div>
              {status === 'success' ? (
                /* 成功状态 */
                <Card className="border-bih-yellow py-16 text-center">
                  <CheckCircle className="mx-auto h-16 w-16 text-bih-yellow-dark" />
                  <h2 className="mt-6 text-2xl font-black uppercase text-bih-navy">
                    {t('contact.successTitle')}
                  </h2>
                  <p className="mt-3 text-bih-gray-500">
                    {t('contact.successDesc')}
                  </p>
                  <Button
                    variant="primary"
                    className="mt-6"
                    onClick={() => setStatus('idle')}
                  >
                    {t('contact.sendAnother')}
                  </Button>
                </Card>
              ) : (
                /* 表单 */
                <form
                  name="contact"
                  method="POST"
                  data-netlify="true"
                  netlify-honeypot="bot-field"
                  onSubmit={handleSubmit}
                >
                  {/* Netlify 隐藏字段 */}
                  <input type="hidden" name="form-name" value="contact" />
                  <p className="hidden">
                    <label>
                      Don't fill this out: <input name="bot-field" />
                    </label>
                  </p>

                  <h2 className="text-xl font-black uppercase tracking-tight text-bih-navy">
                    {t('contact.sendMessage')}
                  </h2>

                  {/* 错误提示 */}
                  {status === 'error' && (
                    <div className="mt-4 flex items-center gap-2 border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      {t('contact.errorMsg')}
                    </div>
                  )}

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    {/* 姓名 */}
                    <div>
                      <label className={labelClass} htmlFor="name">
                        {t('contact.fullName')} <span className="text-bih-orange">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="John Smith"
                        className={inputClass}
                      />
                    </div>

                    {/* 公司 */}
                    <div>
                      <label className={labelClass} htmlFor="company">
                        {t('contact.company')} <span className="text-bih-orange">*</span>
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        required
                        placeholder="Your Company Ltd."
                        className={inputClass}
                      />
                    </div>

                    {/* 邮箱 */}
                    <div>
                      <label className={labelClass} htmlFor="email">
                        {t('contact.email')} <span className="text-bih-orange">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="john@company.ca"
                        className={inputClass}
                      />
                    </div>

                    {/* 电话 */}
                    <div>
                      <label className={labelClass} htmlFor="phone">
                        {t('contact.phone')} <span className="text-bih-orange">*</span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="+1 (905) 000-0000"
                        className={inputClass}
                      />
                    </div>

                    {/* 省份级联 */}
                    <div>
                      <label className={labelClass} htmlFor="province">
                        {t('contact.province')}
                      </label>
                      <select
                        id="province"
                        name="province"
                        value={selectedProvince}
                        onChange={(e) => handleProvinceChange(e.target.value)}
                        className={inputClass}
                      >
                        <option value="">{t('contact.selectProvince')}</option>
                        {provinces.map((p) => (
                          <option key={p.code} value={p.code}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 城市级联 */}
                    <div>
                      <label className={labelClass} htmlFor="city">
                        {t('contact.city')}
                      </label>
                      <select
                        id="city"
                        name="city"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        disabled={!selectedProvince}
                        className={`${inputClass} ${!selectedProvince ? 'bg-bih-gray-100 text-bih-gray-400' : ''}`}
                      >
                        <option value="">{selectedProvince ? t('contact.selectCity') : t('contact.provinceFirst')}</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 消息正文 */}
                  <div className="mt-5">
                    <label className={labelClass} htmlFor="message">
                      {t('contact.message')} <span className="text-bih-orange">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder={t('contact.messagePlaceholder')}
                      className={inputClass}
                    />
                  </div>

                  {/* 提交按钮 */}
                  <div className="mt-6">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={status === 'submitting'}
                    >
                      {status === 'submitting' ? (
                        t('contact.sending')
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          {t('contact.send')}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* ===== 右侧：联系信息 ===== */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-sm font-black uppercase tracking-wider text-bih-navy">
                    {t('contact.infoTitle')}
                  </h3>
                  <div className="mt-4 flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bih-yellow-dark" />
                      <div>
                        <p className="text-sm font-bold text-bih-dark">{t('contact.headOffice')}</p>
                        <p className="text-xs text-bih-gray-500">{t('contact.address')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-bih-yellow-dark" />
                      <div>
                        <p className="text-sm font-bold text-bih-dark">{t('contact.phone')}</p>
                        <p className="text-xs text-bih-gray-500">{t('contact.phoneNumber')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-bih-yellow-dark" />
                      <div>
                        <p className="text-sm font-bold text-bih-dark">{t('contact.email')}</p>
                        <p className="text-xs text-bih-gray-500">{t('contact.emailAddress')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-bih-yellow/30">
                <CardContent className="p-6">
                  <h3 className="text-sm font-black uppercase tracking-wider text-bih-navy">
                    {t('contact.responseTime')}
                  </h3>
                  <p className="mt-2 text-sm text-bih-gray-500">
                    {t('contact.responseDesc')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-sm font-black uppercase tracking-wider text-bih-navy">
                    {t('contact.coverage')}
                  </h3>
                  <p className="mt-2 text-sm text-bih-gray-500">
                    {t('contact.coverageDesc')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
