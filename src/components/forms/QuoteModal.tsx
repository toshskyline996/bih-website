import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { carriers } from '@/data/carriers';
import { provinces, getCitiesByProvince } from '@/data/canada-locations';
import type { Product } from '@/data/products';

/**
 * 产品询价模态弹窗
 * 
 * 从 PDP 页面 "Get a Quote" 按钮触发
 * 预填产品信息 + 客户载体选择 + Netlify Forms 提交
 */

interface QuoteModalProps {
  open: boolean;
  onClose: () => void;
  product: Product;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function QuoteModal({ open, onClose, product }: QuoteModalProps) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<FormStatus>('idle');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const cities = selectedProvince ? getCitiesByProvince(selectedProvince) : [];

  /* Netlify Forms 提交 */
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
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  /* 关闭时重置状态 */
  const handleClose = () => {
    setStatus('idle');
    setSelectedProvince('');
    setSelectedCity('');
    onClose();
  };

  const inputClass =
    'w-full border border-bih-gray-200 bg-white px-3 py-2.5 text-sm text-bih-dark placeholder:text-bih-gray-400 focus:border-bih-yellow focus:outline-none';
  const labelClass = 'block text-xs font-black uppercase tracking-wider text-bih-navy mb-1';

  return (
    <Modal open={open} onClose={handleClose} title={t('quote.title')}>
      {status === 'success' ? (
        /* 成功状态 */
        <div className="py-8 text-center">
          <CheckCircle className="mx-auto h-14 w-14 text-bih-yellow-dark" />
          <h3 className="mt-4 text-xl font-black uppercase text-bih-navy">{t('quote.successTitle')}</h3>
          <p className="mt-2 text-sm text-bih-gray-500">
            {t('quote.successDesc')}
          </p>
          <Button variant="primary" className="mt-6" onClick={handleClose}>
            {t('quote.close')}
          </Button>
        </div>
      ) : (
        <>
          {/* 产品信息预填卡片 */}
          <div className="mb-6 border border-bih-gray-200 bg-bih-gray-100 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-bih-gray-500">
              {t('quote.requestingFor')}
            </p>
            <p className="mt-1 text-sm font-black uppercase text-bih-navy">{product.name}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant="yellow" className="text-[10px]">
                {product.tonnageRange[0]}–{product.tonnageRange[1]}T
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {product.material.body}
              </Badge>
            </div>
          </div>

          <form
            name="quote-request"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
          >
            {/* Netlify 隐藏字段 */}
            <input type="hidden" name="form-name" value="quote-request" />
            <input type="hidden" name="product-name" value={product.name} />
            <input type="hidden" name="product-slug" value={product.slug} />
            <input type="hidden" name="product-tonnage" value={`${product.tonnageRange[0]}-${product.tonnageRange[1]}T`} />
            <p className="hidden">
              <label>
                Don't fill this out: <input name="bot-field" />
              </label>
            </p>

            {/* 错误提示 */}
            {status === 'error' && (
              <div className="mb-4 flex items-center gap-2 border border-red-300 bg-red-50 p-3 text-xs text-red-700">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {t('quote.errorMsg')}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {/* 姓名 */}
              <div>
                <label className={labelClass} htmlFor="q-name">
                  {t('contact.fullName')} <span className="text-bih-orange">*</span>
                </label>
                <input
                  id="q-name"
                  name="name"
                  type="text"
                  required
                  placeholder="John Smith"
                  className={inputClass}
                />
              </div>

              {/* 公司 */}
              <div>
                <label className={labelClass} htmlFor="q-company">
                  {t('contact.company')} <span className="text-bih-orange">*</span>
                </label>
                <input
                  id="q-company"
                  name="company"
                  type="text"
                  required
                  placeholder="Your Company Ltd."
                  className={inputClass}
                />
              </div>

              {/* 邮箱 */}
              <div>
                <label className={labelClass} htmlFor="q-email">
                  {t('contact.email')} <span className="text-bih-orange">*</span>
                </label>
                <input
                  id="q-email"
                  name="email"
                  type="email"
                  required
                  placeholder="john@company.ca"
                  className={inputClass}
                />
              </div>

              {/* 电话 */}
              <div>
                <label className={labelClass} htmlFor="q-phone">
                  {t('contact.phone')} <span className="text-bih-orange">*</span>
                </label>
                <input
                  id="q-phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="+1 (905) 000-0000"
                  className={inputClass}
                />
              </div>

              {/* 省份 */}
              <div>
                <label className={labelClass} htmlFor="q-province">
                  {t('contact.province')}
                </label>
                <select
                  id="q-province"
                  name="province"
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedCity('');
                  }}
                  className={inputClass}
                >
                  <option value="">{t('contact.selectProvince')}</option>
                  {provinces.map((p) => (
                    <option key={p.code} value={p.code}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* 城市 */}
              <div>
                <label className={labelClass} htmlFor="q-city">
                  {t('contact.city')}
                </label>
                <select
                  id="q-city"
                  name="city"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedProvince}
                  className={`${inputClass} ${!selectedProvince ? 'bg-bih-gray-100 text-bih-gray-400' : ''}`}
                >
                  <option value="">{selectedProvince ? t('contact.selectCity') : t('contact.provinceFirst')}</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* 载体品牌 */}
              <div>
                <label className={labelClass} htmlFor="q-carrier-brand">
                  {t('quote.carrierBrand')}
                </label>
                <select
                  id="q-carrier-brand"
                  name="carrier-brand"
                  className={inputClass}
                >
                  <option value="">{t('quote.selectBrand')}</option>
                  {carriers.map((b) => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* 载体型号 */}
              <div>
                <label className={labelClass} htmlFor="q-carrier-model">
                  {t('quote.carrierModel')}
                </label>
                <input
                  id="q-carrier-model"
                  name="carrier-model"
                  type="text"
                  placeholder="e.g. CAT 320, PC200"
                  className={inputClass}
                />
              </div>

              {/* 数量 */}
              <div>
                <label className={labelClass} htmlFor="q-quantity">
                  {t('quote.quantity')}
                </label>
                <input
                  id="q-quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  placeholder="1"
                  className={inputClass}
                />
              </div>
            </div>

            {/* 备注 */}
            <div className="mt-4">
              <label className={labelClass} htmlFor="q-notes">
                {t('quote.notes')}
              </label>
              <textarea
                id="q-notes"
                name="notes"
                rows={3}
                placeholder={t('quote.notesPlaceholder')}
                className={inputClass}
              />
            </div>

            {/* 提交 */}
            <div className="mt-6 flex gap-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? (
                  t('contact.sending')
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {t('quote.submit')}
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={handleClose}>
                {t('quote.cancel')}
              </Button>
            </div>
          </form>
        </>
      )}
    </Modal>
  );
}
