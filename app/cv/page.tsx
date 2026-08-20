import InnerLayout from '@/components/InnerLayout'

export const metadata = { title: 'CV — Victoria Ruiz Diaz' }

export default function CvPage() {
  return (
    <InnerLayout activePage="cv">
      <section className="inner-stage" aria-label="CV">
        <header className="inner-header">
          <h3 className="inner-heading">CV</h3>
        </header>
        <table className="bio-table">
          <tbody>
            <tr>
              <td>nacida</td>
              <td>Lorem ipsum dolor</td>
            </tr>
            <tr>
              <td>formacion</td>
              <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit</td>
            </tr>
            <tr>
              <td>trabaja en</td>
              <td>Lorem ipsum / Dolor sit</td>
            </tr>
            <tr>
              <td>exposiciones</td>
              <td>
                2024 &mdash; <em>Lorem ipsum dolor sit amet</em>, consectetur, adipiscing<br />
                2023 &mdash; <em>Sed do eiusmod tempor</em>, incididunt ut labore, dolor<br />
                2022 &mdash; <em>Ut enim ad minim veniam</em>, quis nostrud exercitation
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </InnerLayout>
  )
}
