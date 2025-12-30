import Image from 'next/image';
import Link from 'next/link';
import { Shield, Users, Gem, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';

export const metadata = {
  title: 'About | Foundation Exclusive',
  description: 'Foundation Exclusive is an extension of Foundation - an exclusive community of high-value NFT collectors and creators.',
};

const stats = [
  { label: 'Verified Collectors', value: '2,500+' },
  { label: 'Curated Collections', value: '150+' },
  { label: 'Total Volume', value: '$45M+' },
  { label: 'Avg. Sale Price', value: '15 ETH' },
];

const values = [
  {
    icon: Shield,
    title: 'Verified Authenticity',
    description: 'Every piece in our marketplace undergoes rigorous verification to ensure authenticity and provenance.',
  },
  {
    icon: Gem,
    title: 'Premium Quality',
    description: 'We curate only the finest digital art from established and emerging artists who meet our high standards.',
  },
  {
    icon: Users,
    title: 'Exclusive Community',
    description: 'Join a selective network of collectors, artists, and enthusiasts who share a passion for exceptional digital art.',
  },
  {
    icon: Award,
    title: 'Investment Grade',
    description: 'Our NFTs are priced to reflect their true value, with a track record of appreciation in the secondary market.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-background-secondary py-20">
        <div className="section-container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-primary/30 bg-accent-primary/10 px-4 py-2 text-sm text-accent-secondary">
              <Gem className="h-4 w-4" />
              <span>An Extension of Foundation</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Welcome to{' '}
              <span className="text-gradient">Foundation Exclusive</span>
            </h1>
            <p className="mt-6 text-lg text-foreground-muted sm:text-xl">
              Foundation Exclusive is the premier destination for high-value NFT collectors 
              and creators. As an extension of Foundation, we offer an exclusive community 
              where exceptional digital art finds its rightful collectors.
            </p>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-accent-primary/5 blur-3xl" />
          <div className="absolute -right-1/4 top-1/3 h-1/2 w-1/2 rounded-full bg-accent-secondary/5 blur-3xl" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-background-secondary py-12">
        <div className="section-container">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-accent-primary sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-foreground-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="section-container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">Our Story</h2>
              <div className="mt-6 space-y-4 text-foreground-muted">
                <p>
                  Foundation Exclusive was born from a simple observation: the NFT market 
                  needed a space dedicated to serious collectors who value quality over 
                  quantity. While Foundation revolutionized how artists connect with 
                  collectors, we saw an opportunity to create something even more refined.
                </p>
                <p>
                  Our platform serves as a curated extension of the Foundation ecosystem, 
                  where every collection is hand-selected and every artist is vetted. We 
                  believe that digital art deserves the same reverence and investment 
                  consideration as traditional fine art.
                </p>
                <p>
                  The prices you see on Foundation Exclusive reflect the true value of 
                  exceptional digital art. Our collectors understand that premium pieces 
                  command premium prices, and our track record of appreciation validates 
                  this approach.
                </p>
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-3xl">
              <Image
                src="https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=800&q=80"
                alt="Digital Art Gallery"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-lg font-semibold text-white">
                  Where exceptional digital art finds its home
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-background-secondary py-20">
        <div className="section-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">What Sets Us Apart</h2>
            <p className="mt-4 text-foreground-muted">
              Foundation Exclusive is built on principles that ensure the highest 
              standards for our community of collectors and creators.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-border bg-background-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-primary/20">
                  <value.icon className="h-6 w-6 text-accent-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{value.title}</h3>
                <p className="text-sm text-foreground-muted">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section className="py-20">
        <div className="section-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Join the Exclusive Community
            </h2>
            <p className="mt-4 text-foreground-muted">
              Foundation Exclusive is more than a marketplace—it&apos;s a community of 
              like-minded individuals who understand the value of exceptional digital art. 
              Our members enjoy early access to drops, exclusive events, and a network 
              of fellow collectors and artists.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Become a Member
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="secondary" size="lg">
                  Explore Collections
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="section-container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-accent-primary to-accent-secondary p-8 sm:p-12">
            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Ready to Experience the Exclusive?
              </h2>
              <p className="mt-4 text-lg text-white/80">
                Discover why serious collectors choose Foundation Exclusive for their 
                most valued acquisitions.
              </p>
              <div className="mt-8">
                <Link href="/explore">
                  <Button
                    size="lg"
                    className="bg-white text-accent-primary hover:bg-white/90"
                  >
                    View Collections
                  </Button>
                </Link>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          </div>
        </div>
      </section>
    </div>
  );
}