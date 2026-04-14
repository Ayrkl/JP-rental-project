import { AdminLayout } from './components/admin/AdminLayout';

function App() {
  return (
    <AdminLayout>
      <div className="empty-state-glass">
        <h2>Admin Paneline Hoş Geldiniz</h2>
        <p>Sol menüden "Mülkler" sekmesine giderek yeni bir ev tanımlayabilir, <br/>Japonya genelindeki portföyünüzü buradan yönetebilirsiniz.</p>
      </div>
    </AdminLayout>
  );
}

export default App;
