function AuthLayout({ children, title }) {
  return (
    <main className="auth-layout">
      <section className="auth-card">
        <div className="auth-card__header">

          <h1>{title}</h1>
        </div>

        {children}
      </section>
    </main>
  );
}

export default AuthLayout;