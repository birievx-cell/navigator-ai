export default function GosPomoshPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-4xl font-bold">
        Господдержка бизнеса
      </h1>

      <p className="mt-4 text-lg text-gray-600">
        Подбор грантов, субсидий, льготных кредитов и программ поддержки бизнеса.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="text-4xl">🏛️</div>
          <h3 className="mt-4 text-xl font-bold">Гранты</h3>
          <p className="mt-2 text-gray-600">
            Поиск доступных программ финансирования.
          </p>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="text-4xl">💰</div>
          <h3 className="mt-4 text-xl font-bold">Льготные кредиты</h3>
   v className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="text-4xl">📈</div>
          <h3 className="mt-4 text-xl font-bold">Субсидии</h3>
          <p className="mt-2 text-gray-600">
            Компенсация затрат на развитие бизнеса.
          </p>
        </div>
      </div>
    </main>
  );
}
