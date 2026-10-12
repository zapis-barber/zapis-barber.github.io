// Уведомления владельцу о новых записях. Этот файл подключается к фоновому помощнику сайта (sw.js)
// и работает, даже когда приложение закрыто: получает сообщение и показывает его на экране.
self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch {
    // пришло что-то нечитаемое — покажем уведомление без подробностей
  }
  event.waitUntil(
    self.registration.showNotification(data.title || 'Новая запись', {
      body: data.body || 'Откройте кабинет, чтобы посмотреть.',
      icon: data.icon,
      badge: data.icon,
      tag: data.tag,
      data: { url: data.url || '/' },
    }),
  )
})

// Нажатие на уведомление открывает кабинет владельца (или переключает на уже открытый).
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = new URL((event.notification.data && event.notification.data.url) || '/', self.location.origin).href
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      const open = windows.find((client) => client.url.startsWith(target))
      return open ? open.focus() : self.clients.openWindow(target)
    }),
  )
})
