<template>
	<section>
		<div style="padding-top: 120px;">
			<div>
				<div>
					<div class="mx-auto text-center">
						<h1 class="fw-bold" style="font-size: 36px; color: var(--text-color-primary)">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Gravida augue ultricies varius
						</h1>
						<p class="mt-3" style="font-size: 24px; color: var(--text-color-secondary)">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Gravida augue ultricies varius 
						</p>
						<router-link to="signin" class="action-special">Get started</router-link>
					</div>
				</div>
			</div>
		</div>

		<div style="padding-top: 120px;">
			<div>
				<div>
					<h5 class="fw-bold">Protect your API keys</h5>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Imperdiet orci sed commodo tincidunt. Ipsum mattis sed eu in sit et. Bibendum sem eget feugiat morb.</p>
				</div>
			</div>
		</div>
	</section>
</template>

<script lang='ts'>
import {Vue, Component} from 'vue-property-decorator';

@Component
export default class Home extends Vue {
}
</script>